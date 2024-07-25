import express from "express";
import {
  verifyAndAuthorization,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  checkUserSubscription,
  createSubscription,
  getAllUsersSubscriptionTypeData,
} from "../controllers/userSubscription.controller.js";
const router = express.Router();
router.use(verifyToken);

// Check User Subscription
router.get(
  "/checkUserSubscription",
  verifyAndAuthorization,
  checkUserSubscription
);

//get All Users Subscription Type Data
router.get("/", verifyAndAuthorization, getAllUsersSubscriptionTypeData);

//create Subscription
router.post("/", verifyAndAuthorization, createSubscription);

export default router;
