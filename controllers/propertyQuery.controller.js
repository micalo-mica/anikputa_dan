import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";

export const queryProperty = async (req, res) => {
  try {
    const {
      type,
      city,
      state = "",
      category = "",
      selectedPrice,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    } = req.query;

    const pageNo = Number(page) || 1;
    const limitNo = Number(limit) || 10;
    const skip = (page - 1) * limit;

    const queryObject = { isAvailable: true };

    if (type) {
      queryObject.type = type;
    }
    if (category) {
      queryObject.category = category;
    }
    if (city) {
      queryObject.city = { $regex: city, $options: "i" };
    }
    if (state) {
      queryObject.state = { $regex: state, $options: "i" };
    }

    // if (minPrice && maxPrice) {
    //   queryObject.price = { $gte: minPrice, $lte: maxPrice };
    // } else if (minPrice) {
    //   queryObject.price = { $gte: minPrice };
    // } else if (maxPrice) {
    //   queryObject.price = { $lte: maxPrice };
    // }

    const sortQuery = {};
    if (selectedPrice === "lower") {
      sortQuery.price = 1; // Sort by ascending price (lowest first)
    } else if (selectedPrice === "high") {
      sortQuery.price = -1; // Sort by descending price (highest first)
    } else {
      // Default sorting key if selectedPrice is not provided
      sortQuery._id = 1; // Sort by ascending _id (default order)
    }

    const properties = await propertyModel.find(queryObject).sort(sortQuery);

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

export const nearbySimilarProperty = async (req, res) => {
  try {
    const { type, city = "", state = "", category = "" } = req.query;

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
