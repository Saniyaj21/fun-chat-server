import mongoose from 'mongoose';

// Define Message Schema
const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export const Message = mongoose.model("Message", messageSchema)