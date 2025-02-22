import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// CORS configuration for Express
app.use(cors({
  origin: "*",
  exposedHeaders: ['X-Total-Count'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Total-Count"],
}));

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Track connected users
let activeUsers = 0;

io.on('connection', (socket) => {
  console.log('A user connected');
  activeUsers++;
  
  // Emit active users count to all clients
  io.emit('activeUsers', activeUsers);

  socket.on('message', (message) => {
    // Broadcast the message with the sender's socket ID
    io.emit('message', {
      text: message,
      senderId: socket.id, // Include sender's socket ID
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    activeUsers--;
    io.emit('activeUsers', activeUsers);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});