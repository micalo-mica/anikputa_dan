import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";

export const getAgentProperties = async (req, res) => {
  try {
    let properties = await propertyModel.find({ creatorId: req.userId });
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Properties gotten successfully",
      properties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getAgentProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    let property = await propertyModel.findById(propertyId);
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Properties gotten successfully",
      property,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Route to get total number of properties listed by an agent
export const getAgentTotalProperty = async (req, res) => {
  try {
    const userId = req.userId;
    const totalProperties = await propertyModel.countDocuments({
      creatorId: userId,
    });

    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Total properties gotten successfully",
      totalProperties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// Route to get total number of each property type listed by an agent
export const getAgentTotalPropertyType = async (req, res) => {
  try {
    const userId = req.userId;
    const propertyTypes = await propertyModel.aggregate([
      { $match: { creatorId: userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Total properties types gotten successfully",
      propertyTypes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getSinglePropertyType = async (req, res) => {
  const { type } = req.query;
  const creatorId = req.userId;
  try {
    const typeFound = await propertyModel.find({
      type: type,
      creatorId: creatorId,
    });
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Types gotten successfully",
      typeFound,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
