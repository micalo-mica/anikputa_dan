import express from "express";
import { scheduleMeeting } from "../controllers/meeting.controller.js";
const router = express.Router();

//schedule Meeting
router.post("/", scheduleMeeting);

export default router;
