import express from "express";
import {
  verifyAndAuthorization,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  deleteAccount,
  editUserProfile,
  getUserProfileInfo,
} from "../controllers/userProfile.controller.js";
const router = express.Router();
router.use(verifyToken);

//get user profile
router.get("/", verifyAndAuthorization, getUserProfileInfo);

//edit profile for user
router.post("/editUserProfile", verifyAndAuthorization, editUserProfile);

//edit profile for user
router.delete("/", verifyAndAuthorization, deleteAccount);

export default router;
