import { StatusCodes } from "http-status-codes";
import reasonModel from "../models/reason.model.js";

export const createReason = async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      msg: "Tell us reason",
    });
  }

  try {
    const newReason = new reasonModel({
      userId: req.userId,
      reason,
    });
    await newReason.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Reason created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
