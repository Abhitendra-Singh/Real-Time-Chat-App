const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/user-helpers'); // FIX: Changed from './utils/users' to './utils/user-helpers'
const { formatMessage } = require('./utils/message-helpers'); // FIX: Changed from './utils/messages' to './utils/message-helpers'

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve the frontend client file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-client.html'));
});

// Serve the utility files in case they are ever needed by client (not in this case, but good practice)
app.use('/utils', express.static(path.join(__dirname, 'utils')));


const BOT_NAME = 'ChatBot';

// Run when a client connects
io.on('connection', socket => {
  console.log('New WebSocket Connection...');

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(BOT_NAME, `Welcome to the ${user.room} room!`, 'notification'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(BOT_NAME, `${user.username} has joined the chat`, 'notification'));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(user.username, msg.content, msg.type, msg.fileName));
    }
  });

  // Listen for typing indicator
  socket.on('typing', () => {
    const user = getCurrentUser(socket.id);
    if (user) {
        socket.broadcast.to(user.room).emit('typing', user.username);
    }
  });

  // Listen for stop typing
  socket.on('stopTyping', () => {
    const user = getCurrentUser(socket.id);
    if (user) {
        socket.broadcast.to(user.room).emit('stopTyping', user.username);
    }
  });
  
  // Listen for message reaction
  socket.on('messageReaction', ({ messageId, reaction }) => {
      const user = getCurrentUser(socket.id);
      if(user){
        io.to(user.room).emit('reactionUpdate', { messageId, reaction, username: user.username });
      }
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(BOT_NAME, `${user.username} has left the chat`, 'notification')
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

