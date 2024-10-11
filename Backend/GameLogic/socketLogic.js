const { io } = require("../server");
const { nanoid } = require("nanoid");
const {
  guessResult,
  startNewRound,
  getUsers,
  getUser,
  startGame,
  putUser,
  deleteUser,
  deleteUsersExceptRoom,
  getRoom,
} = require("./game");
const { runGame } = require("./runAgent");

let rooms = ["123"];

console.log("enetred");

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const createRoom = ({ socket, username }) => {
  for (let i = 0; i < 5; i++) {
    let roomID = nanoid(5);
    if (!rooms.includes(roomID)) {
      rooms.push(roomID);
      console.log(rooms);
      putUser({ Id: socket.id, name: username, room: roomID, isCreator: true });
      return roomID;
    }
  }
  throw new Error("Room creation failed");
};

const joinRoom = ({ socket, username, room }) => {
  console.log(rooms.includes(room));
  console.log(socket.id);
  if (!rooms.includes(room)) {
    throw new Error("Room not found");
  }
  if (!getUser({ Id: socket.id })) {
    putUser({ Id: socket.id, name: username, room: room, isCreator: false });
  }
};

const leaveRoom = ({ Id }) => {
  // let user = getUser({Id})
  // if( !user && user.isCreator){
  //   rooms = rooms.filter(x => x != user.room)
  //   deleteUsersExceptRoom(user.room)
  //   throw new Error("Creator Left");
  // }
  console.log("leave");
  console.log(Id);

  let user = getUser({ Id });
  console.log(user);

  if (user) {
    if (user.isCreator) {
      rooms = rooms.filter((x) => x != user.room);
    }
    deleteUser({ Id });
  }
};

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("createRoom", (username, callback) => {
    try {
      let roomid = createRoom({ socket, username });
      socket.join(roomid);
      callback(roomid);
    } catch (error) {
      callback(error);
    }
  });

  socket.on("joinRoom", (res, callback) => {
    try {
      joinRoom({ socket, username: res.username, room: res.room });
      socket.join(res.room);
      io.to(res.room).emit("userList", getUsers(res.room).foundUsers);
      callback({
        code: 1,
        user: getUser({ Id: socket.id }),
      });
    } catch (error) {
      console.log("error", error);
      callback({
        code: 0,
        message: error.message,
      });
    }
  });

  socket.on("laeveRoom", () => {
    try {
      let room = getRoom({ Id: socket.id });
      socket.leave(room);
      leaveRoom({ Id: socket.id });
      io.to(room).emit("userList", getUsers(room).foundUsers);
    } catch (error) {
      io.emit({
        errorCode: 5,
        message: error.message,
      });
    }
  });

  socket.on("guess", async ({word , isGameStarted}) => {
    let room = await getRoom({ Id: socket.id });
    console.log(isGameStarted);
    console.log(word);
    
    if(!isGameStarted){
     io.to(room).emit("guessResult" , { user: "NONE", word: word, type: false , Id: socket.id , score: null }) 
     console.log("sent Chat");
     return
    }
    console.log("sent guess");
    
    io.to(room).emit(
      "guessResult",
      guessResult({ guess: word, Id: socket.id })
    );
  });

  socket.on("startGame", async (callback) => {
    const room = getRoom({ Id: socket.id });
    const param = await startGame(room);
    callback(param);
    socket.broadcast.to(room).emit("startingGame" , param)
    sleep(3000);
    runGame(param, room);
  });

  socket.on("drawing", (data) => {
    const room = getRoom({ Id: socket.id });
    socket.broadcast.to(room).emit("drawing", data);
  });

  socket.on("clearCanvas", () => {
    const room = getRoom({ Id: socket.id });
    socket.broadcast.to(room).emit("clearCanvas");
  });


  socket.on("disconnect", () => {
    console.log("user disconnected");
    let room = getRoom({ Id: socket.id });
    leaveRoom({ Id: socket.id });
    io.to(room).emit("userList", getUsers(room).foundUsers);
  });
});
