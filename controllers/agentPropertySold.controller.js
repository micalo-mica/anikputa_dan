import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import soldModel from "../models/sold.model.js";

export const createAgentPropertiesSold = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.userId;
  const { sellerType } = req.body;
  try {
    let foundIsSold = await soldModel.findOne({ propertyId: propertyId });
    if (foundIsSold) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "You have update this property before",
      });
    }

    let property = await propertyModel.findById(propertyId);

    if (property.type === "rent" || property.type === "commercial") {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Type is not allow",
      });
    }
    let soldData = {};
    // if statement
    if (sellerType === "orantage") {
      soldData = {
        propertyId: property._id,
        sellerType: "orantage",
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        lga: property.lga,
        state: property.state,
        price: property.price,
      };
    } else if (sellerType === "agent") {
      soldData = {
        propertyId: property._id,
        sellerId: userId,
        sellerType: "agent",
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        lga: property.lga,
        state: property.state,
        price: property.price,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid property type" });
    }

    const soldProperty = new soldModel(soldData);
    await soldProperty.save();
    // update property
    property.isSold = true;
    await property.save();
    // return
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getAgentPropertiesSold = async (req, res) => {
  try {
    let properties = await soldModel.find({ sellerId: req.userId });
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

export const getAgentPropertySold = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.userId;
  try {
    const property = await propertyModel.findById(propertyId);
    if (property.creatorId.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: true,
        msg: "You can only see property you sold",
      });
    }
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
export const getAgentTotalPropertySold = async (req, res) => {
  try {
    const userId = req.userId;
    const totalSold = await soldModel.countDocuments({
      sellerId: userId,
    });
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Total properties gotten successfully",
      totalSold,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
