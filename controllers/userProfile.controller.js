import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model.js";
import propertyModel from "../models/property.model.js";
import agentModel from "../models/agent.model.js";
import {
  uploadImage,
  removeFromCloudinary,
} from "../funcs/cloudinary/cloudinay.js";
import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
import { v2 as cloudinary } from "cloudinary";
const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;
// cloudinary
cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

export const getUserProfileInfo = async (req, res) => {
  try {
    const profile = await userModel.findById(req.userId);
    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Something went wrong fetching your profile details",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Your profile",
      profile,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const editUserProfile = async (req, res) => {
  const { name, address, city, state, phoneNumber, postalCode, licenseNumber } =
    req.body;
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User not found" });
    }
    let dataToChange = {
      lastName: name || user.name,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      phoneNumber: phoneNumber || user.phoneNumber,
      postalCode: postalCode || user.postalCode,
      licenseNumber: licenseNumber || user.licenseNumber,
    };

    await userModel.findByIdAndUpdate(
      req.userId,
      { $set: dataToChange },
      { new: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Info updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const deleteAccount = async (req, res) => {
  const userId = req.userId;
  try {
    //check user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `User not found`,
      });
    }
    //check agent
    const agent = await agentModel.findOne({ userId: userId });
    if (agent) {
      // Find agent by ID and retrieve imageUrl and cloudinaryId
      const { imageUrl, cloudinaryId } = agent;
      // Delete agent's image from Cloudinary
      await cloudinary.uploader.destroy(cloudinaryId);
      // await removeFromCloudinary(cloudinaryId);
      // Delete agent from database
      await agentModel.findByIdAndDelete(agent._id);
      // Find properties associated with the agent
      const properties = await propertyModel.find({ creatorId: userId });
      // Iterate through each property
      for (const property of properties) {
        // Iterate through each image of the property
        for (const image of property.images) {
          // Delete property image from Cloudinary
          await cloudinary.uploader.destroy(image.cloudinaryId);
        }
        // Delete property from database
        await propertyModel.findByIdAndDelete(property._id);
      }
      // delete user
      await userModel.findByIdAndDelete(userId);
      // return
      res.status(StatusCodes.OK).json({
        success: true,
        msg: "Agent and associated properties deleted successfully.",
      });
    } else {
      // delete user
      await userModel.findByIdAndDelete(userId);
      // return
      res.status(StatusCodes.OK).json({
        success: true,
        msg: "Agent and associated properties deleted successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
