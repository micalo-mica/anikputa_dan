import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import paymentModel from "../models/payment.model.js";
const { PAYSTACK_SECRET_KEY } = process.env;
import subscriptionModel from "../models/subscription.model.js";
import userSubscriptionModel from "../models/userSubscription.model.js";

// ============== get payment detail in payStack server and checkout =======================
export const verifyWebHook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const event = req.body;
      // ===========check if the payment was successful=============
      if (event.event === "charge.success") {
        // Do something with event
        const data = event.data;
        const payId = data.id;
        const status = data.status;
        const reference = data.reference;
        const amount = data.amount;
        const currency = data.currency;
        const channel = data.channel;
        // get sub
        const subscription = await subscriptionModel.findOne({
          reference: reference,
        });
        // not found
        if (!subscription) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ success: false, msg: "Subscription not found" });
        }
        // check if the paid amount is correct
        if (amount < subscription.price) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            msg: "Amount paid is less than the price to pay",
          });
        }
        // to save
        const newPaymentDetail = new paymentModel({
          userId: subscription.userId,
          subscriptionId: subscription._id,
          amount,
          payId,
          reference,
          currency,
          status,
          channel,
        });
        // save
        const payed = await newPaymentDetail.save();
        // calc months
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + subscription.durationMonths);
        // delete any old sub
        await userSubscriptionModel.findOneAndDelete({
          userId: subscription.userId,
        });
        // create user sub
        const newUserSubscription = new userSubscriptionModel({
          userId: subscription.userId,
          subscriptionId: subscription._id,
          paymentId: payed._id,
          startDate,
          endDate,
          isActive: true,
        });
        await newUserSubscription.save();
        res.status(StatusCodes.OK).json({
          success: true,
          msg: "Subscription created Successfully",
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST);
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
