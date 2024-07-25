import express from "express";
const router = express.Router();
import {
  verifyAgentAndCompany,
  verifyIsApproved,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  getAgentProperties,
  getAgentProperty,
  getAgentTotalProperty,
  getAgentTotalPropertyType,
  getSinglePropertyType,
} from "../controllers/agentDashBoard.controller.js";
router.use(verifyToken);

//get all properties of an agents
router.get("/", verifyAgentAndCompany, getAgentProperties);

//get all property of an agents
router.get(
  "/getAgentProperty/:propertyId",
  verifyAgentAndCompany,
  // verifyIsApproved,
  getAgentProperty
);

// Route to get total number of properties listed by an agent
router.get(
  "/getAgentTotalProperty",
  verifyAgentAndCompany,
  // verifyIsApproved,
  getAgentTotalProperty
);

// Route to get total number of each property type listed by an agent
router.get(
  "/getAgentTotalPropertyType",
  verifyAgentAndCompany,
  // verifyIsApproved,
  getAgentTotalPropertyType
);

//get single property type listed
router.get(
  "/getSinglePropertyType",
  verifyAgentAndCompany,
  // verifyIsApproved,
  getSinglePropertyType
);

export default router;
