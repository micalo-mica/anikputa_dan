import express from "express";
import { verifyWebHook } from "../controllers/payment.controller.js";
const router = express.Router();

//schedule Meeting
router.post("/verifyWebHook", verifyWebHook);

export default router;
