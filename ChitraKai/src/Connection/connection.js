import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const createRoom = (username, callback) => {
  socket.emit("createRoom", username, (roomid) => {
    // This callback is executed when the server responds with the room ID
    callback(roomid);
  });
};

const joinRoom = (username, room, callback) => {
  socket.emit(
    "joinRoom",
    {
      username: username,
      room: room,
    },
    (res) => {
      callback(res);
    }
  );
};

const leaveRoom = () => {
  socket.emit("laeveRoom");
};

const emitGuess = (guess) => {
  socket.emit("guess", guess);
};

const onNewRound = (callback) => {
  socket.on("newRound", callback);
};
const onRoundEnd = (callback) => {
  socket.on("roundEnd", callback);
};
const onGameOver = (callback) => {
  socket.on("gameOver", callback);
};
const onStartingGame =(callback)=>{
  socket.on("startingGame" , callback)
}
const startGame = (callback) => {
  socket.emit("startGame", (res) => {
    callback(res);
  });
};

const onUserList = (callback) => {
  socket.on("userList", callback);
};

const onGuessResult = (callback) => {
  socket.on("guessResult", callback);
};

const emitStartDrawing = ({ offsetX, offsetY, brushSize, color }) => {
  socket.emit("drawing", { type: "start", offsetX, offsetY, brushSize, color });
};

const emitEndDrawing = () => {
  socket.emit("drawing", { type: "end" });
};

const emitDrawing = ({ offsetX, offsetY }) => {
  socket.emit("drawing", { type: "draw", offsetX, offsetY });
};

const emitClearCanvas = () => {
  socket.emit("clearCanvas");
};

const onDrawingEvent = (callback) => {
  socket.on("drawing", callback);
};

const onClearCanvasEvent = (callback) => {
  socket.on("clearCanvas", callback);
};

export {
  socket,
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
  emitGuess,
  emitStartDrawing,
  emitEndDrawing,
  emitDrawing,
  emitClearCanvas,
  onDrawingEvent,
  onClearCanvasEvent,
  onUserList,
  onGuessResult,
  onNewRound,
  onRoundEnd,
  onGameOver,
  onStartingGame
};
