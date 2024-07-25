import express from "express";
import {
  verifyAndAuthorization,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  deletePropertySubTo,
  isSubToPropertyAvailability,
  newlyCreatedPropertiesNewly,
  newlyCreatedPropertiesWeekly,
  premiumSearchPropertiesForRent,
  propertiesSubscribeTo,
  subscribePropertiesAvailable,
  subscribePropertyInMarket,
  userSubscribedPropertyAvailable,
  weeklyProperties,
} from "../controllers/userPremiumFeatures.controller.js";
const router = express.Router();
router.use(verifyToken);

// Get Available Properties Based on User Subscription
router.get("/", verifyAndAuthorization, userSubscribedPropertyAvailable);

// Get Properties Based on Weekly Created Properties and User Subscription, Matching User Subscription Criteria
router.get(
  "/newlyCreatedPropertiesWeekly",
  verifyAndAuthorization,
  newlyCreatedPropertiesWeekly
);

// Get Properties Based on Newly Created Properties and User Subscription, Matching User Subscription Criteria
router.get(
  "/newlyCreatedPropertiesNewly",
  verifyAndAuthorization,
  newlyCreatedPropertiesNewly
);

// Get Weekly Properties Filtered by Subscriptions
router.get("/weeklyProperties", verifyAndAuthorization, weeklyProperties);

// premium Search Properties For Rent forms
router.get(
  "/premiumSearchPropertiesForRent",
  verifyAndAuthorization,
  premiumSearchPropertiesForRent
);

// get user properties subscribe to
router.get(
  "/propertiesSubscribeTo",
  verifyAndAuthorization,
  propertiesSubscribeTo
);

// Subscribe to property available updates
router.post(
  "/subscribePropertiesAvailable",
  verifyAndAuthorization,
  subscribePropertiesAvailable
);

//check if property is saved
router.get(
  "/check/isSubToPropertyAvailability/:propertyId",
  verifyAndAuthorization,
  isSubToPropertyAvailability
);

// Subscribe to property in market updates
router.post("/", verifyAndAuthorization, subscribePropertyInMarket);

// // Notify users when a property becomes available
// router.post(
//   "/sendPropertyAvailabilityEmailToUsers/:propertyId",
//   verifyAndAuthorization,
//   sendPropertyAvailabilityEmailToUsers
// );

// remove
router.delete("/:id", verifyAndAuthorization, deletePropertySubTo);

export default router;
