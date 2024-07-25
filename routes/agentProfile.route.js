import express from "express";
import {
  verifyAgentAndCompany,
  verifyOwner,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  addImage,
  addOwnerImage,
  editAgentProfile,
  editOwnerProfile,
  getAgentProfile,
  getOwnerProfile,
} from "../controllers/agentProfile.controller.js";
import upload from "../funcs/cloudinary/upload.js";
const router = express.Router();
router.use(verifyToken);

//get agent profile
router.get("/", verifyAgentAndCompany, getAgentProfile);

//edit profile for agent
router.post("/editAgentProfile", verifyAgentAndCompany, editAgentProfile);

//add image for agent
router.put(
  "/addImage",
  verifyAgentAndCompany,
  upload.single("image"),
  addImage
);

// ======================owner=======================
//get owner profile
router.get("/getOwnerProfile", verifyOwner, getOwnerProfile);

//edit owner profile
router.put("/editOwnerProfile", verifyOwner, editOwnerProfile);

//add owner image
router.put(
  "/addOwnerImage",
  verifyOwner,
  upload.single("image"),
  addOwnerImage
);

export default router;
