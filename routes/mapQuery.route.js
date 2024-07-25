import express from "express";
const router = express.Router();
import { queryMap } from "../controllers/mapQuery.controller.js";

// map
router.get("/", queryMap);

export default router;
