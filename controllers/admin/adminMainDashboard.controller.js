import clientModel from "../../models/client.model.js";
import { StatusCodes } from "http-status-codes";

export const getAllClients = async (req, res) => {
  try {
    const clients = await clientModel.find({}).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account has been activated",
      clients,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getSingleClient = async (req, res) => {
  try {
    const client = await clientModel.findById(req.params.id);
    console.log("noe");

    if (!client) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Client not found",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account has been activated",
      client,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Your request could not be processed. Please try again" });
  }
};

// total unapproved users
export const getUnapprovedUsersCount = async (req, res) => {
  try {
    const countUsers = await userModel.countDocuments({
      isVerified: false,
      isApproved: false,
      isActive: false,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account gotten",
      countUsers,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Your request could not be processed. Please try again" });
  }
};
