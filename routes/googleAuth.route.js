import express from "express";
import {
  authGoogle,
  authGoogleCallback,
} from "../controllers/googleAuth.controller.js";

const router = express.Router();

// initiate
router.get("/auth/google", authGoogle);

// callback
router.get("/auth/google/callback", authGoogleCallback);

export default router;
