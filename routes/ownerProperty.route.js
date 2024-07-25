import express from "express";
import { verifyOwner, verifyToken } from "../middlewares/verifyToken.js";
import {
  getOwnerProperties,
  getOwnerProperty,
} from "../controllers/ownerProperty.controller.js";
import upload from "../funcs/cloudinary/upload.js";
const router = express.Router();
router.use(verifyToken);

//get all properties of owner
router.get("/", verifyOwner, getOwnerProperties);

//get all property of an owner
router.get("/getOwnerProperty/:propertyId", verifyOwner, getOwnerProperty);

export default router;
