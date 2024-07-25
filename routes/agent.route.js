import express from "express";
import {
  createAgentAccount,
  deleteAgentAccount,
} from "../controllers/agent.controller.js";
import {
  verifyAgentAndCompanyAndOwner,
  verifyToken,
} from "../middlewares/verifyToken.js";
import upload from "../funcs/cloudinary/upload.js";

const router = express.Router();

// create Agent Account
router.post("/", verifyToken, upload.single("image"), createAgentAccount);

// delete Agent Account
router.delete(
  "/",
  verifyToken,
  verifyAgentAndCompanyAndOwner,
  deleteAgentAccount
);

export default router;
