import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";

export const queryMap = async (req, res) => {
  try {
    // const { type, city, state = "", category = "" } = req.query;
    const { type, city, state, category } = req.query;
    console.log(type, city, state, category);

    const queryObject = { isAvailable: true };

    if (type) {
      queryObject.type = type;
    }
    if (category) {
      queryObject.category = category;
    }
    if (city) {
      queryObject.city = city;
    }
    if (state) {
      queryObject.state = state;
    }

    let properties = await propertyModel.find(queryObject);

    // If no properties match the filter, fetch all properties
    if (properties.length === 0) {
      properties = await propertyModel.find({ isAvailable: true, type: type });
    }

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
