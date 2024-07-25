import express from "express";

import { getRandomFlat } from "../controllers/rent.controller.js";
const router = express.Router();

//create property
router.get("/", getRandomFlat);

export default router;
