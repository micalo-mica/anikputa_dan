import { StatusCodes } from "http-status-codes";
import clientModel from "../models/client.model.js";

export const createClient = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    description,
  } = req.body;

  try {
    const dataToSave = new clientModel({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      description,
    });
    const client = await dataToSave.save();
    // return
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Created successfully",
      client,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
