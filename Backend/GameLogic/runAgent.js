const { io } = require("../server");
const { startNewRound, getUsers , clearScore } = require("./game");

const runGame = (param, room) => {
  if (!param.type) return;
  let currRound = 0;
  const roundDuration = param.contents.roundTime || 30000;
  try {
    clearScore(room)
    const { drawer, word } = startNewRound(getUsers(room));

    //First Round
    currRound++;
    io.to(room).emit("newRound", {
      drawer,
      word,
      round: currRound,
      message: `round ${currRound} started, drawer ${drawer.Id} word ${word}`,
    });
    setTimeout(() => {
      io.to(room).emit("roundEnd", { round: currRound });
      io.to(room).emit("clearCanvas");
    }, roundDuration - roundDuration * 0.03);

    // Rest Rounds continues from here
    const interval = setInterval(() => {
      if (currRound < param.contents.rounds) {
        // task
        const { drawer, word } = startNewRound(getUsers(room));
        currRound++;
        io.to(room).emit("newRound", {
          drawer,
          word,
          round: currRound,
          message: `round ${currRound} started, drawer ${drawer.Id} word ${word}`,
        });
        setTimeout(() => {
          io.to(room).emit("roundEnd", { round: currRound });
          io.to(room).emit("clearCanvas");
        }, roundDuration - roundDuration * 0.03);
      } else {
        currRound = 0;
        clearInterval(interval);
        // game over
        io.emit("gameOver", { message: "Game Over" });
      }
    }, roundDuration);
  } catch (error) {
    currRound = 0;
    clearInterval(interval);
    // game over
    io.emit("gameOver", { message: "Game Over" });
    console.error(error);
  }
};

module.exports = { runGame };
