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


// routes import

import messageRoute from './routes/messageRoute.js';


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


  socket.on('message', (messageData) => {
    console.log('Broadcasting message:', messageData); // Debug log
    // Broadcast the message to all clients EXCEPT the sender
    socket.broadcast.emit('message', messageData);

    // Save to MongoDB asynchronously
    const newMessage = new Message({ text: messageData.text, name: messageData.name });
    newMessage.save()
      .then(() => console.log('1', messageData))
      .catch((err) => console.error('0'));

  });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
    activeUsers--;
    io.emit('activeUsers', activeUsers);
  });
});






app.use("/api/messages", messageRoute);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});