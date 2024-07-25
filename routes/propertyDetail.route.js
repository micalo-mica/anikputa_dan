import express from "express";
import {
  verifyAndAuthorization,
  verifyAgent,
} from "../middlewares/verifyToken.js";
import {
  getPropertyDetail,
  getPropertyDetailWithVisualId,
  propertyCardAgentInfo,
} from "../controllers/propertyDetail.controller.js";
const router = express.Router();

//get property
router.get("/getPropertyDetail/:propertyId", getPropertyDetail);

//get property with visual Id
router.get(
  "/getPropertyDetailWithVisualId/visualId/:visualId",
  getPropertyDetailWithVisualId
);

//property info
router.get("/:propertyId", propertyCardAgentInfo);

export default router;
