import React from "react";
import { CiEraser } from "react-icons/ci";

function Tools({
  color,
  setColor,
  brushSize,
  setBrushSize,
  clearCanvas,
  room,
  isCreator,
  onStart,
  isGameStarted,
}) {
  return (
    <div className="flex flex-col">
      <div className="rounded-md p-4 flex flex-col gap-4 justify-center items-center text-white ">
        <div className="mb-6">
          <h1>ROOM ID {room}</h1>
        </div>
        <div id="colors" className="flex flex-col gap-1">
          <h1 className=" text-center">Colors</h1>
          <div className="flex gap-2">
            <span
              onClick={(e) => setColor("#ffffff")}
              className="rounded-full cursor-pointer border-white border bg-white h-4 w-4"
            ></span>
            <span
              onClick={(e) => setColor("#000000")}
              className="rounded-full cursor-pointer border-white border bg-black h-4 w-4"
            ></span>
            <span
              onClick={(e) => setColor("#dc2626")}
              className="rounded-full cursor-pointer border-white border bg-red-600 h-4 w-4"
            ></span>
            <span
              onClick={(e) => setColor("#16a34a")}
              className="rounded-full cursor-pointer border-white border bg-green-600 h-4 w-4"
            ></span>
            <span
              onClick={(e) => setColor("#9333ea")}
              className="rounded-full cursor-pointer border-white border bg-purple-600 h-4 w-4"
            ></span>
            <CiEraser
              onClick={(e) => setColor("#334155")}
              className="rounded-full cursor-pointer bg-transparent size-5 text-teal-400"
            />
          </div>
        </div>
        <input
          min={"1"}
          max={"30"}
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          type="range"
        />
        <button onClick={clearCanvas} className="mt-2 p-2 bg-rose-700 rounded">
          CLEAR CANVAS
        </button>
      </div>
      {isCreator&& !isGameStarted?<button onClick={onStart} className="bg-rose-800 rounded px-2 py-1 mx-4 text-white">START</button>: ""}
    </div>
  );
}

export default Tools;
