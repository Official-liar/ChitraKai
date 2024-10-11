
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server =  http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods: ['GET', 'POST'],
    }
})


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { io };
console.log("passed");
require('./GameLogic/socketLogic')