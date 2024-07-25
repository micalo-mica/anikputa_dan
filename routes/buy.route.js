import express from "express";
const router = express.Router();
import { getRandomBuy } from "../controllers/buy.controller.js";

//create property
router.get("/", getRandomBuy);

export default router;
