import express from "express";
import {
  verifyAgentAndCompany,
  verifyIsApproved,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  createAgentPropertiesSold,
  getAgentPropertiesSold,
  getAgentPropertySold,
  getAgentTotalPropertySold,
} from "../controllers/agentPropertySold.controller.js";
const router = express.Router();
router.use(verifyToken);

//create sold
router.post(
  "/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  createAgentPropertiesSold
);

//get all properties of an agents sold
router.get(
  "/",
  verifyAgentAndCompany,
  verifyIsApproved,
  getAgentPropertiesSold
);

//get a property an agents sold
router.get(
  "/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  getAgentPropertySold
);

//count sold
router.get(
  "/getAgentTotalPropertySold/count",
  verifyAgentAndCompany,
  verifyIsApproved,
  getAgentTotalPropertySold
);

export default router;
