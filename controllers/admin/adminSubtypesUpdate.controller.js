import { StatusCodes } from "http-status-codes";
import usersSubscriptionTypeDataModel from "../../models/usersSubscriptionTypeData.model.js";

export const createUsersSubscriptionTypeData = async (req, res) => {
  const { type, duration, price, description } = req.body;
  try {
    if (!type || !duration || !price || !description) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: true, msg: "Fill all fields" });
    }

    // create the subscription
    const newUsersSubscriptionTypeData = new usersSubscriptionTypeDataModel({
      type,
      duration,
      price,
      description,
    });
    await newUsersSubscriptionTypeData.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Created successful",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const adminGetAllUsersSubscriptionTypeData = async (req, res) => {
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

export const editUsersSubscriptionTypeData = async (req, res) => {
  const { type, duration, price, description } = req.body;
  try {
    const usersSubscriptionTypeData =
      await usersSubscriptionTypeDataModel.findById(id);

    if (!usersSubscriptionTypeData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Not found" });
    }

    const toSave = {
      type: type || usersSubscriptionTypeData.type,
      duration: duration || usersSubscriptionTypeData.duration,
      price: price || usersSubscriptionTypeData.price,
      description: description || usersSubscriptionTypeData.description,
    };

    await usersSubscriptionTypeDataModel.findByIdAndUpdate(id, toSave, {
      new: true,
    });

    if (!usersSubscriptionTypeData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "successful",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
