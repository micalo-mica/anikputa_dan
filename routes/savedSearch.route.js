import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  deleteSavedProperty,
  getSavedProperty,
  isSaved,
  saveProperty,
} from "../controllers/savedSearch.controller.js";

//save property
router.post("/:propertyId", verifyToken, saveProperty);

//get save property
router.get("/", verifyToken, getSavedProperty);

//check if property is saved
router.get("/isSaved/:propertyId", verifyToken, isSaved);

//get save property
router.delete("/:id", verifyToken, deleteSavedProperty);

export default router;
