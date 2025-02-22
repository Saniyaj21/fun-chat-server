import express from "express";
import { getAllMessages } from "../controllers/messageControllers.js";

const router = express.Router();

router.get('/all', getAllMessages);



export default router;