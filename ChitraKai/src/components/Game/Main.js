import React, { useEffect, useRef, useState } from "react";
import Tools from "./Tools";
import CanvasPaint from "./CanvasPaint";
import UserPanel from "./Userpanel/UserPanel";
import { useParams, useLocation, useBeforeUnload } from "react-router-dom";
import {
  joinRoom,
  leaveRoom,
  socket,
  startGame,
  onNewRound,
  onRoundEnd,
  onGameOver,
  onStartingGame,
} from "../../Connection/connection";
import { useNavigate } from "react-router-dom";
import Bus from "./FlashScreen/Utils/bus";

function Main() {
  const { roomId } = useParams();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username");

  const [canDraw, setCanDraw] = useState(false);
  const [canChat , setCanChat] = useState(true)
  const [correctGuess , setCorrectGuess] = useState(false)
  const [isCreator, setIsCreator] = useState(false);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(0);

  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState("");
  const [word , setWord] = useState("")

  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(10);

  const clearCanvasRef = useRef(null);
  const navigate = useNavigate();

  const clearCanvas = () => {
    if (clearCanvasRef.current) {
      clearCanvasRef.current();
    }
  };
  const onStart = () => {
    startGame((res) => {
      if (!res.type) alert(res.message);
      else {
        setRoundTime(res.contents.roundTime);
        setIsGameStarted(res.contents.isGameStarted);
        console.log(res.message);
        Bus.emit("flash", {
          message: res.message,
          type: "success", // Type: 'success', 'error', 'warning'
        });
      }
    });
  };

  onNewRound(({ drawer, word, round, message }) => {
    setRound(round);
    if (socket.id === drawer.Id) { 
      setCanDraw(true);
      setCanChat(false);
      setWord(word)
    }
    Bus.emit("flash", {
      message: `Round : ${round}`,
      type: "newRound", // Type: 'success', 'error', 'warning'
    });
  });
  onRoundEnd(({ round }) => {
    // console.log(`round end ${round}`)
    setCanDraw(false);
    setCanChat(true)
    setCorrectGuess(false)
    setWord("")
    Bus.emit("flash", {
      message: "Next Round is Starting",
      type: "endRound", // Type: 'success', 'error', 'warning'
    });
  });
  onGameOver(({ message }) => {
    setIsGameStarted(false);
    console.log(message);
    Bus.emit("flash",{
      message : message,
      type : "gameOver"  // Type: 'success', 'error', 'warning'
    })
  });
  onStartingGame(({ type, contents, message }) => {
    if (!type) alert(message);
    else {
      setRoundTime(contents.roundTime);
      setIsGameStarted(contents.isGameStarted);
      console.log(message);
      Bus.emit("flash",{
        message : message,
        type : "gameStarting"  // Type: 'success', 'error', 'warning'
      })
    }
  });

  joinRoom(username, roomId, (res) => {
    if (res.code == 1) {
      setIsCreator(res.user.isCreator);
    } else {
      alert(res.message);
      navigate("/");
    }
  });
  useBeforeUnload((e) => {
    e.preventDefault();
    alert("leaving room");
    leaveRoom();
    socket.off("joinRoom");
  });
  useEffect(() => {}, []);

  return (
    <div className="flex flex-1 py-4 contain-content w-full h-full gap-4 px-4 justify-around items-center bg-slate-950">
      <Tools
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        room={roomId}
        isCreator={isCreator}
        isGameStarted={isGameStarted}
        onStart={onStart}
      />
      <CanvasPaint
        color={color}
        brushSize={brushSize}
        clearCanvasRef={clearCanvasRef}
        round={round}
        isGameStarted={isGameStarted}
        canDraw={canDraw}
        word={word}
      />
      <UserPanel guess={guess} setGuess={setGuess} canChat={canChat} isGameStarted={isGameStarted} correctGuess={correctGuess} setCorrectGuess={setCorrectGuess}/>
    </div>
  );
}

export default Main;
