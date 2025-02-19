import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// CORS configuration for Express
app.use(cors({
  origin: 'https://corona-chat.vercel.app',
  methods: ['GET', 'POST'],
}));

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: 'https://corona-chat.vercel.app',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'], // Explicitly allow both
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


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});