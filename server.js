import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://corona-chat.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    io.emit('message', message); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});