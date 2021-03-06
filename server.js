// my config/////////

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const http = require('http');
// const port = 8000;
require('dotenv').config()
const cors = require('cors');
const {Server} = require('socket.io');

// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002",
    credentials: true,
    methods: ["GET", "POST"],
  }
});
'use strict';
// other persons config ///////
// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);
// require ("dotenv").config();
// const path = require("path");
// const morgan = require('morgan');


io.on('connection', (socket) => {
  console.log("user connected", socket.id);

  socket.on('join_room', (roomID) => {
    socket.join(roomID);
    // console.log(socket.data);
    console.log(`User with ID: ${socket.id} has joined room: ${roomID}`);
    
  })

  socket.on('leave_room', (roomID) => {
    console.log('[socket]','leave room :', roomID);
    socket.leave(roomID);
    socket.to(roomID).emit('user left', socket.id);
  })

  socket.on('send_message', (data) => {
    console.log(data);
    // console.log(socket);
    socket.to(data.room).emit('receive_message', data);
    // console.log('success');
  })

  ///// trying video //////
  // socket.on("stream", (data) => {
  //   socket.broadcast.to(data.room).emit('stream', data.video)
  // })
  //////////////////////// Playing Around!!! ////////////////////////
  // socket.on('add_url', (data) => {
  //   socket.to(data.room).emit('receive_url', data);
  // })
/////////////////////////////////////////////////////////////////////

  socket.on('disconnect', () => {
    console.log("user disconnected", socket.id);
  });
});

// const ikea = require('ikea-name-generator');

// STEP 0: install socket.io // EITHER in npm i or add it to the package.json with specific version

// STEP 1: require socket.io
// const socketio = require('socket.io');
// STEP 2: require http
// const http = require('http');
// const app = express();
// STEP 3: WRAP app in the HTTP createServer function
// const server = http.createServer(app);
// STEP 4: user socket.io to make a socket server at the same http server/port
// const io = socketio(server);

// Socket.io // Real Time
// Listeners  -- Someone connect?
//            -- someone sent a message?
//            -- someone disconnected?
/////////////////////////////////////////////////////////
// let userList =[];


// middleware
app.use(morgan('dev'));
app.use(express.json());

// import the router(s)
const todosRouter = require('./routes/todos-router');
const usersRouter = require('./routes/users-router');
const messagesRouter = require('./routes/messages-router');
const roomsRouter = require('./routes/rooms-router');

// app.use the router(s)
app.use('/todos', todosRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/rooms', roomsRouter);

const PORT = process.env.PORT || 8000
if(process.env.NODE_ENV){
    app.use( express.static(__dirname + '/client/build'));
    app.get('*', (request, response) => {
	    response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

server.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});