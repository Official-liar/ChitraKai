import React, { useEffect, useRef, useState } from "react";
import {
  socket,
  emitStartDrawing,
  emitEndDrawing,
  emitDrawing,
  emitClearCanvas,
  onDrawingEvent,
  onClearCanvasEvent,
} from "../../Connection/connection";
import FlashScreen from "./FlashScreen/FlashScreen";

function CanvasPaint({
  color,
  brushSize,
  clearCanvasRef,
  canDraw,
  isGameStarted,
  word
}) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "white";
    context.lineWidth = 30;
    contextRef.current = context;
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasDimensions();

    // Set dimensions on window resize to maintain correct size
    window.addEventListener("resize", setCanvasDimensions);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
      console.log(brushSize);
    }
  }, [color, brushSize]);

  const startDrawing = (e) => {
    contextRef.current.beginPath();
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    emitStartDrawing({ offsetX, offsetY, brushSize, color });
  };
  const endDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    emitEndDrawing();
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    emitDrawing({ offsetX, offsetY });
  };
  const handleMouseLeave = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    onDrawingEvent(({ type, offsetX, offsetY, brushSize, color }) => {
      switch (type) {
        case "start":
          contextRef.current.strokeStyle = color;
          contextRef.current.lineWidth = brushSize;
          contextRef.current.beginPath();
          contextRef.current.moveTo(offsetX, offsetY);
          break;
        case "draw":
          contextRef.current.lineTo(offsetX, offsetY);
          contextRef.current.stroke();
          break;
        case "end":
          contextRef.current.closePath();
          break;
        default:
          break;
      }
    });

    onClearCanvasEvent(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("drawing");
      socket.off("clearCanvas");
    };
  }, []);

  // Function to clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    emitClearCanvas();
  };

  useEffect(() => {
    clearCanvasRef.current = clearCanvas;
  }, [clearCanvasRef]);

  return (
    <>
      <div className=" h-full py-20 w-full px-14 flex items-center justify-center relative">
        {!isGameStarted && <div className="absolute py-20 px-14 z-10 w-full h-full ease-linear duration-700">
        <div className="bg-black/80 w-full h-full ease-linear duration-700 flex text-white items-center justify-center px-8"> Waiting! for the round to start</div>
      </div>}
        {/* Overlay */}
        {
          canDraw ? <div className=" absolute top-10 flex items-center justify-center z-20 text-white"><h1 className="text-white">Your Word is : {word} </h1></div> : ""
        }
        <FlashScreen otherStyle={""} />
        <canvas
          className={`border w-full h-full bg-slate-700 rounded-md  ${
            canDraw && isGameStarted ? "" : "hover:cursor-not-allowed"
          }`}
          ref={canvasRef}
          onMouseDown={!canDraw ? () => {} : startDrawing}
          onMouseUp={!canDraw ? () => {} : endDrawing}
          onMouseMove={!canDraw ? () => {} : draw}
          onMouseLeave={!canDraw ? () => {} : handleMouseLeave}
        />
      </div>
    </>
  );
}

export default CanvasPaint;
