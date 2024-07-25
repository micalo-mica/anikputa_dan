import { StatusCodes } from "http-status-codes";
import subscriptionModel from "../models/subscription.model.js";
import userSubscriptionModel from "../models/userSubscription.model.js";
import usersSubscriptionTypeDataModel from "../models/usersSubscriptionTypeData.model.js";
import PropertySubscriptionUpdateModel from "../models/propertySubscriptionUpdate.model.js";

export const checkUserSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    // Find active subscriptions for the user
    const activeSubscriptions = await userSubscriptionModel.find({
      userId,
      isActive: true,
      endDate: { $gt: new Date() }, // Ensure the subscription is still valid
    });

    if (activeSubscriptions.length > 0) {
      res.status(StatusCodes.OK).json({
        success: true,
        msg: "successful",
        isSubscribed: true,
      });
    } else {
      res.status(StatusCodes.OK).json({
        success: true,
        msg: "successful",
        isSubscribed: false,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getAllUsersSubscriptionTypeData = async (req, res) => {
  try {
    const usersSubscriptionTypeData = await usersSubscriptionTypeDataModel.find(
      {}
    );

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "successful",
      usersSubscriptionTypeData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// create the subscription
export const createSubscription = async (req, res) => {
  const { ref, id } = req.body;
  try {
    // check
    if (!ref || !id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Something went wrong" });
    }
    // find old sub and delete
    await subscriptionModel.findOneAndDelete({ userId: req.userId });
    // find sub
    const sub = await usersSubscriptionTypeDataModel.findById(id);
    // check
    if (!sub) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Something went wrong" });
    }
    // create the subscription
    const newSubscription = new subscriptionModel({
      userId: req.userId,
      durationMonths: sub.duration,
      price: sub.price,
      name: "user",
      reference: ref,
      type: sub.type,
    });
    const createdSubscription = await newSubscription.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Successfully, we are processing your subscription",
      createdSubscription,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
