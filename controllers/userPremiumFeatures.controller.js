import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import weeklyCreatedPropertyModel from "../models/weeklyCreatedProperty.model.js";
import newlyCreatedPropertyModel from "../models/newlyCreatedProperty.model.js";
import propertySubscriptionUpdateModel from "../models/propertySubscriptionUpdate.model.js";
import userSubscriptionModel from "../models/userSubscription.model.js";
import schedule from "node-schedule";
import { sendAvailableMail } from "../utils/emails/sendAvailableMail.js";
import { sendInMarketMail } from "../utils/emails/sendInMarketMail.js";

const { DOMAIN } = process.env;

// Get Available Properties Based on User Subscription
export const userSubscribedPropertyAvailable = async (req, res) => {
  try {
    const userId = req.userId;
    // Fetch the user's property subscription updates with type 'available'
    const subscriptions = await propertySubscriptionUpdateModel.find({
      userId,
      updateFor: "available",
    });
    const properties = [];
    for (const subscription of subscriptions) {
      const query = {
        isAvailable: true,
        ...(subscription.state && { state: subscription.state }),
        ...(subscription.city && { city: subscription.city }),
        ...(subscription.category && { category: subscription.category }),
        $and: [
          { price: { $gte: subscription.minPrice || 0 } },
          { price: { $lte: subscription.maxPrice || Infinity } },
        ],
      };

      const matchingProperties = await propertyModel.find(query);
      properties.push(...matchingProperties);
    }
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "successful",
      properties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Get Properties Based on Weekly Created Properties and User Subscription, Matching User Subscription Criteria
export const newlyCreatedPropertiesWeekly = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch the user's property subscription updates with updateFor 'market'
    const subscriptions = await propertySubscriptionUpdateModel.find({
      userId,
      updateFor: "market",
    });

    if (subscriptions.length === 0) {
      return res.status(200).send([]);
    }

    // Get all weekly created property IDs
    const weeklyCreatedProperties = await weeklyCreatedPropertyModel.find({});
    const propertyIds = weeklyCreatedProperties.map((item) => item.propertyId);

    const properties = [];
    for (const subscription of subscriptions) {
      const query = {
        _id: { $in: propertyIds },
        ...(subscription.state && { state: subscription.state }),
        ...(subscription.city && { city: subscription.city }),
        ...(subscription.category && { category: subscription.category }),
        $and: [
          { price: { $gte: subscription.minPrice || 0 } },
          { price: { $lte: subscription.maxPrice || Infinity } },
        ],
      };
      const matchingProperties = await Property.find(query);
      properties.push(...matchingProperties);
    }

    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "successful",
      properties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Get Properties Based on Newly Created Properties and User Subscription, Matching User Subscription Criteria/ not in use now
export const newlyCreatedPropertiesNewly = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's property subscription updates with updateFor 'market'
    const subscriptions = await propertySubscriptionUpdateModel.find({
      userId,
      updateFor: "market",
    });

    if (subscriptions.length === 0) {
      return res.status(200).send([]);
    }

    // Get all newly created property IDs
    const newlyCreatedProperties = await newlyCreatedPropertyModel.find({});
    const propertyIds = newlyCreatedProperties.map((item) => item.propertyId);

    const properties = [];
    for (const subscription of subscriptions) {
      const query = {
        _id: { $in: propertyIds },
        ...(subscription.state && { state: subscription.state }),
        ...(subscription.city && { city: subscription.city }),
        ...(subscription.category && { category: subscription.category }),
        $and: [
          { price: { $gte: subscription.minPrice || 0 } },
          { price: { $lte: subscription.maxPrice || Infinity } },
        ],
      };

      const matchingProperties = await propertyModel.find(query);
      properties.push(...matchingProperties);
    }

    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "successful",
      properties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Get Weekly Properties Filtered by Subscriptions
export const weeklyProperties = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyCreatedProperties = await weeklyCreatedPropertyModel
      .find({
        createdAt: { $gte: oneWeekAgo },
      })
      .populate("propertyId");

    const properties = [];
    for (const entry of weeklyCreatedProperties) {
      const property = entry.propertyId;
      const subscriptions = await PropertiesSubscriptionUpdate.find({
        type: "market",
        ...(property.state && { state: property.state }),
        ...(property.city && { city: property.city }),
        ...(property.category && { category: property.category }),
        $or: [
          { minPrice: { $lte: property.price } },
          { maxPrice: { $gte: property.price } },
        ],
      }).populate("userId");

      subscriptions.forEach((subscription) => {
        if (subscription.userId) {
          properties.push(property);
        }
      });
    }
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "successful",
      properties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// premium Search Properties For Rent forms
export const premiumSearchPropertiesForRent = async (req, res) => {
  try {
    const { name, lga, visualId, address, city, state, category } = req.query;

    const queryObject = {};

    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (address) {
      queryObject.address = { $regex: address, $options: "i" };
    }
    if (city) {
      queryObject.city = { $regex: city, $options: "i" };
    }
    if (state) {
      queryObject.state = { $regex: state, $options: "i" };
    }
    if (lga) {
      queryObject.lga = { $regex: lga, $options: "i" };
    }
    if (visualId) {
      queryObject.visualId = visualId;
    }
    if (category) {
      queryObject.category = category;
    }

    // apply
    const properties = await propertyModel.find(queryObject).limit(20);

    // return
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Property filtered", properties });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get user properties subscribe to
export const propertiesSubscribeTo = async (req, res) => {
  try {
    const { updateFor } = req.query;

    const propertySubscriptionUpdates =
      await propertySubscriptionUpdateModel.find({
        userId: req.userId,
        updateFor,
      });
    // check
    if (!propertySubscriptionUpdates) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Not found" });
    }
    // return
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Subscription to property updates was successful",
      propertySubscriptionUpdates,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Subscribe to property available updates
export const subscribePropertiesAvailable = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.userId;
  try {
    const property = await propertyModel.findById(propertyId);
    // check
    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }
    // check
    const isPropertyAdded = await propertySubscriptionUpdateModel.findOne({
      propertyId,
      userId,
    });
    // if true
    if (isPropertyAdded) {
      await propertySubscriptionUpdateModel.findOneAndDelete({
        propertyId,
        userId,
      });
      // return
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Subscription removed was successful",
      });
    } else {
      // check
      const propertySubscriptionUpdate = new propertySubscriptionUpdateModel({
        userId: userId,
        propertyId: property._id,
        state: property.state,
        city: property.city,
        type: property.type,
        updateFor: "available",
      });
      await propertySubscriptionUpdate.save();
      // return
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Subscription to property updates was successful",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const isSubToPropertyAvailability = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.userId;
  try {
    // check
    const isAdded = await propertySubscriptionUpdateModel.findOne({
      propertyId,
      userId,
    });
    if (isAdded) {
      return res.status(StatusCodes.OK).json({ msg: true });
    } else {
      return res.status(StatusCodes.OK).json({ msg: false });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Subscribe to property in market updates
export const subscribePropertyInMarket = async (req, res) => {
  const { state, type, city, category, minPrice, maxPrice } = req.body;

  try {
    const propertySubscriptionUpdate = new propertySubscriptionUpdateModel({
      userId: req.userId,
      type,
      state,
      city,
      category,
      minPrice,
      maxPrice,
      UpdateFor: "market",
    });

    await propertySubscriptionUpdate.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Subscription for property updates in market successful",
      propertySubscriptionUpdate,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// // Notify users when a property becomes available
// export const sendPropertyAvailabilityEmailToUsers = async (req, res) => {
//   const propertyId = req.params.id;
//   try {
//     const property = await propertyModel.findById(propertyId);
//     // check
//     if (!property) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: false, msg: "Property not found" });
//     }
//     // check isAvailable
//     if (!property.isAvailable) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, msg: "Property is not available" });
//     }
//     // property sub for
//     const subscriptions = await propertySubscriptionUpdateModel
//       .find({
//         property: property._id,
//       })
//       .populate("user");
//     for (const subscription of subscriptions) {
//       const user = subscription.user;
//       // Check if the user has an active subscription
//       const activeSubscriptions = await UserSubscription.find({
//         user: user._id,
//         endDate: { $gt: new Date() },
//         paymentStatus: "Completed",
//       });

//       if (activeSubscriptions.length > 0) {
//         const subject =
//           "New Property Alert: A Home That Matches Your Preferences!";
//         // const text = `Dear ${user.name},\n\nThe property "${property.name}" is now available for rent.\n\nBest regards,\nYour Company`;
//         const propertyId = property._id;
//         const city = property.city;
//         const state = property.state;
//         const price = property.price;
//         const desc = property.description;
//         const url = `${DOMAIN}/property/${propertyId}`;

//         await sendAvailableMail({
//           email: user.email,
//           subject,
//           user: user.name,
//           url,
//           city,
//           state,
//           price,
//           desc,
//         });
//       }
//     }

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       msg: "Notifications sent",
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

// delete property sub to
export const deletePropertySubTo = async (req, res) => {
  const { id } = req.params;
  try {
    const subTo = await propertySubscriptionUpdateModel.findById(id);
    // check
    if (!subTo) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Not found" });
    }
    // check
    if (req.userId !== subTo.userId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "You can only remove your own save" });
    }
    // delete now
    await propertySubscriptionUpdateModel.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// clone jobs
// Function to delete weekly created properties older than one week
const deleteOldWeeklyCreatedProperties = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await weeklyCreatedPropertyModel.deleteMany({
      createdAt: { $lt: oneWeekAgo },
    });
  } catch (err) {
    console.error("Error deleting old weekly created properties:", err);
  }
};

// Schedule the task to run every week
schedule.scheduleJob("0 0 * * 0", deleteOldWeeklyCreatedProperties); // Every Sunday at midnight

// Function to check newly created properties and send emails
const checkNewlyCreatedProperties = async () => {
  console.log("I can run on my own!");
  try {
    const newlyCreatedProperties = await newlyCreatedPropertyModel.find({});

    if (newlyCreatedProperties.length > 0) {
      for (const newlyCreatedProperty of newlyCreatedProperties) {
        const property = await propertyModel.findById(
          newlyCreatedProperty.propertyId
        );

        if (property) {
          const query = {
            ...(property.state && { state: property.state }),
            ...(property.city && { city: property.city }),
            ...(property.category && { category: property.category }),
            ...(property.price && {
              $or: [
                { minPrice: { $lte: property.price } },
                { maxPrice: { $gte: property.price } },
              ],
            }),
          };

          const subscriptions = await propertySubscriptionUpdateModel
            .find(query)
            .populate("userId");

          for (const subscription of subscriptions) {
            const userSubscription = await userSubscriptionModel.findOne({
              userId: subscription.userId._id,
              endDate: { $gte: new Date() },
            });

            if (userSubscription) {
              const user = subscription.userId;
              const email = user.email;
              const name = user.name;
              const subject =
                "Hot New Listing: Check Out This Just-Listed Property!";
              const propertyId = property._id;
              const city = property.city;
              const state = property.state;
              const price = property.price;
              const desc = property.description;
              const url = `${DOMAIN}/property/${propertyId}`;

              await sendInMarketMail({
                email,
                subject,
                user: name,
                url,
                city,
                state,
                price,
                desc,
              });
              // await sendEmail(
              //   user.email,
              //   "New Property Available",
              //   `A new property matching your preferences is now available: ${property.name}`
              // );
            }
          }
        }

        // Remove the processed newly created property entry
        await newlyCreatedPropertyModel.findByIdAndDelete(
          newlyCreatedProperty._id
        );
      }
    }
  } catch (err) {
    console.error("Error checking newly created properties:", err);
  }
};

// Schedule the task to run every hour
schedule.scheduleJob("0 * * * *", checkNewlyCreatedProperties);
