import express from "express";
import { createReason } from "../controllers/reason.controller.js";
import {
  verifyAgentAndCompanyAndOwner,
  verifyToken,
} from "../middlewares/verifyToken.js";
const router = express.Router();

//schedule Meeting
router.post("/", verifyToken, verifyAgentAndCompanyAndOwner, createReason);

export default router;
