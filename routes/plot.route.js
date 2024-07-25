import express from "express";
const router = express.Router();
import { getRandomPlot } from "../controllers/plot.controller.js";

//create property
router.get("/", getRandomPlot);

export default router;
