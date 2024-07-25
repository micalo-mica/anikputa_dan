import express from "express";
import {
  verifyAndAuthorization,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  sendPropertyAvailabilityEmailToUsers,
  totalUserSubToProperty,
} from "../controllers/propertySubscriptionUpdate.controller.js";
const router = express.Router();
router.use(verifyToken);

// main end point
// propertySubscriptionUpdate

// Notify users when a property becomes available
router.post("/", verifyAndAuthorization, sendPropertyAvailabilityEmailToUsers);

// Notify users when a property becomes available
router.get("/:propertyId", verifyAndAuthorization, totalUserSubToProperty);

export default router;
