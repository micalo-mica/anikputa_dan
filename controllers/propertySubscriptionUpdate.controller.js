import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import propertySubscriptionUpdateModel from "../models/propertySubscriptionUpdate.model.js";
import userSubscriptionModel from "../models/userSubscription.model.js";

// Notify users when a property becomes available
export const sendPropertyAvailabilityEmailToUsers = async (req, res) => {
  const { propertyId } = req.body;
  try {
    const property = await propertyModel.findById(propertyId);
    // check
    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }
    // check isAvailable
    if (!property.isAvailable) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Property is not available" });
    }

    // property sub for
    const subscriptions = await propertySubscriptionUpdateModel
      .find({
        propertyId: property._id,
        // property: property._id,
      })
      .populate("userId");
    for (const subscription of subscriptions) {
      const user = subscription.userId;
      // Check if the user has an active subscription
      const activeSubscriptions = await userSubscriptionModel.find({
        userId: user._id,
        endDate: { $gt: new Date() },
        paymentStatus: "Completed",
      });

      if (activeSubscriptions.length > 0) {
        const subject =
          "New Property Alert: A Home That Matches Your Preferences!";
        // const text = `Dear ${user.name},\n\nThe property "${property.name}" is now available for rent.\n\nBest regards,\nYour Company`;
        const propertyId = property._id;
        const city = property.city;
        const state = property.state;
        const price = property.price;
        const desc = property.description;
        const url = `${DOMAIN}/property/${propertyId}`;
        const email = user.email;
        const user = user.name;
        await sendAvailableMail({
          email,
          subject,
          user,
          url,
          city,
          state,
          price,
          desc,
        });
      }
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Notifications sent",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Route to get total number of properties listed by an agent
export const totalUserSubToProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const totalUsers = await propertySubscriptionUpdateModel.countDocuments({
      propertyId,
    });

    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Total properties gotten successfully",
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
