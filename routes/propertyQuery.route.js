import express from "express";
const router = express.Router();
import {
  nearbySimilarProperty,
  queryProperty,
} from "../controllers/propertyQuery.controller.js";

//get property
router.get("/", queryProperty);

//get nearby similar property
router.get("/nearbySimilarProperty", nearbySimilarProperty);

export default router;
