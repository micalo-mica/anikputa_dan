import express from "express";
import {
  register,
  login,
  verifyUser,
  forgot,
  reset,
  resendOTP,
  resendForgotOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();

// For registering a user
router.post("/register", register);

// For activating a user
router.post("/verifyUser", verifyUser);

// For resend OTP to user
router.post("/resendOTP", resendOTP);

// For login a user
router.post("/login", login);

// For a user forgot password
router.post("/forgot", forgot);

// For a user reset password
router.post("/reset", reset);

// =====resend forgot OTP=====
router.post("/resendForgotOTP", resendForgotOTP);

export default router;
