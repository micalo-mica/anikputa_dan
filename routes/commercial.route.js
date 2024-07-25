import express from "express";
const router = express.Router();
import { getRandomCommercial } from "../controllers/commercial.controller.js";

//create property
router.get("/", getRandomCommercial);

export default router;
