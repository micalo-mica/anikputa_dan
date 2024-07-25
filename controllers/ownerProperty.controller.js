import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import {
  uploadImage,
  removeFromCloudinary,
} from "../funcs/cloudinary/cloudinay.js";
import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/user.model.js";
const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;

// cloudinary
cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

export const getOwnerProperties = async (req, res) => {
  try {
    let properties = await propertyModel.find({
      creatorId: req.userId,
      type: "rent",
    });
    // return
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

export const getOwnerProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    let property = await propertyModel.findById(propertyId);

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
