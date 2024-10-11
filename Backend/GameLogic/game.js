let users = [];
let totalRounds = 3;
let roundTime = 60000;
let currentDrawerIndex = 0;
let currentWord = "blackpeople";

const words = [
  "superman",
  "apple",
  "whitehouse",
  "blackpeople",
  "batman",
  "spiderman",
  "sachin",
];

const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

const putUser = ({ Id, name, room , isCreator }) => {
  users.push({ Id, name, room , isCreator ,score:0 });
};

const deleteUser = ({ Id }) => {
  users = users.filter((x) => x.Id != Id);
};

const getUsers = (room) => {
  let length =0
  const foundUsers = users.filter((x) => {
    if(x.room === room){
      length++
      return true
    }
    return false
  });
  return {
    foundUsers,
    length
  }
};

const getUser = ({ Id }) => {
  console.log(users);
  
  return users.find((x) => {
    console.log(x);
    
    if(x.Id === Id){
      return true
    }
    else false
  });
};

const getUsersExcept = (user)=>{
  return users.filter(x=> x.room == user.room && !user.isCreator)
}

const deleteUsersExceptRoom = (room)=>{
  users = users.filter(x=> x.room != room)
}

const getRoom = ({ Id }) => {
  let roomVal = "";
  users.forEach((x) => {
    if (x.Id === Id) {
      roomVal = x.room;
    }
  });
  return roomVal;
};

const startGame = async (room) => {
  const res = await getUsers(room)
  console.log(res.length);
  
  if (res.length < 2) {
    return {
      type: false,
      contents: {},
      message: "Not enough User",
    };
  }

  return {
    type: true,
    contents : {
      rounds : totalRounds,
      roundTime : roundTime,
      isGameStarted: true
    },
    message: "Game is Starting ...",
  };
};

const startNewRound = (localUsers) => {
  currentDrawerIndex = (currentDrawerIndex + 1) % localUsers.length;
  currentWord = getRandomWord();
  return { drawer: users[currentDrawerIndex], word: currentWord };
};

const clearScore = (room)=>{
  users.forEach((x)=>{
    if(x.room === room){
      x.score = 0
    }
  })
}

const endRound = () => {
  return;
};

const guessResult = ({ guess, Id }) => {
  let tp;
  let userName;
  let score;
  if (guess === currentWord) {
    tp = true;
    users.forEach((x) => {
      if (x.Id == Id) {
        x.score += 10
        score = x.score
        userName = x.name;
      }
    });
  } else tp = false;

  return { user: userName, word: guess, type: tp , Id , score: score };
};

module.exports = {
  startNewRound,
  getUser,
  getRoom,
  endRound,
  guessResult,
  getUsers,
  startGame,
  putUser,
  deleteUser,
  getUsersExcept,
  deleteUsersExceptRoom,
  clearScore
};
