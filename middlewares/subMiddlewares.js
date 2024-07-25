import { StatusCodes } from "http-status-codes";
import userSubscriptionModel from "../models/userSubscription.model.js";

// for client
export const checkSubscription = async (req, res, next) => {
  const userId = req.userId; // Assuming user ID is available in req.user
  try {
    const activeSubscription = await userSubscriptionModel.findOne({
      userId,
      isActive: true,
      endDate: { $gt: new Date() }, // Ensure the subscription is still valid
    });

    if (activeSubscription) {
      next(); // User has an active subscription, proceed to the route
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Access denied. No active subscription found.",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
