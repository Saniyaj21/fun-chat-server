import express from 'express';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './db/connect.js';
import { Message } from './models/messageModel.js';

const app = express();
const server = http.createServer(app);
connectDB();

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
    console.log('Broadcasting message:', message); // Debug log
    // Broadcast the message to all clients EXCEPT the sender
    socket.broadcast.emit('message', message);

    // Save to MongoDB asynchronously
    const newMessage = new Message({ text: message });
    newMessage.save()
      .then(() => console.log('Message saved to MongoDB:', message))
      .catch((err) => console.error('Error saving message to MongoDB:', err));

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