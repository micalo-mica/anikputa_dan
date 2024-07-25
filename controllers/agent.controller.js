import { StatusCodes } from "http-status-codes";
import agentModel from "../models/agent.model.js";
import { v4 as uuidv4 } from "uuid";
import {
  uploadImage,
  removeFromCloudinary,
} from "../funcs/cloudinary/cloudinay.js";
import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/user.model.js";
import propertyModel from "../models/property.model.js";
const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;

// cloudinary
cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

export const createAgentAccount = async (req, res) => {
  const userId = req.userId;
  try {
    const {
      accountType,
      firstName,
      lastName,
      city,
      state,
      address,
      postalCode,
      phoneNumber,
      // agent
      education,
      experienceYears,
      specialties,
      bio,
      // owner
      notes,
      // company
      companyName,
      industry,
      companyLicenseNumber,
      servicesOffered,
    } = req.body;

    // check fields
    if (
      !accountType ||
      !firstName ||
      !lastName ||
      !city ||
      !address ||
      !postalCode ||
      !state
    ) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Some details are missing or invalid" });
    }
    //check agentFound
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: `You must have account before you can create this account or login first`,
      });
    }
    const agentFound = await agentModel.findOne({ email: user.email });
    if (agentFound) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: `You have agent account already in our system or your account is under verification.`,
      });
    }
    // Upload new image to Cloudinary
    const file = req.file;
    const dataUri = parser.format(file.originalname, file.buffer);
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "ID",
    });
    // Save Cloudinary URL and ID to MongoDB
    const imageUrl = result.secure_url;
    const cloudinaryId = result.public_id;

    // ==================Based on the condition starts========================
    let accountData = {};

    if (accountType === "agent") {
      accountData = {
        userId,
        email: user.email,
        accountType,
        firstName,
        lastName,
        address,
        city,
        state,
        postalCode,
        phoneNumber,
        experienceYears,
        education,
        specialties,
        bio,
        cloudinaryId,
        imageUrl,
      };
    } else if (accountType === "owner") {
      accountData = {
        userId,
        email: user.email,
        accountType,
        firstName,
        lastName,
        address,
        city,
        state,
        postalCode,
        phoneNumber,
        notes,
        cloudinaryId,
        imageUrl,
      };
    } else if (accountType === "company") {
      accountData = {
        userId,
        email: user.email,
        accountType,
        firstName,
        lastName,
        city,
        state,
        postalCode,
        companyName,
        industry,
        address,
        city,
        state,
        postalCode,
        phoneNumber,
        companyName,
        industry,
        companyLicenseNumber,
        servicesOffered,
        cloudinaryId,
        imageUrl,
        //
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid property type" });
    }
    // save
    const newAccountData = new agentModel(accountData);
    await newAccountData.save();
    // update type in users model
    await userModel.findByIdAndUpdate(
      userId,
      { $set: { accountType: accountType } },
      { new: true }
    );
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully, please log out and log in again. We are verifying your account",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const deleteAgentAccount = async (req, res) => {
  const userId = req.userId;
  try {
    //check agent
    const agent = await agentModel.findOne({ userId: userId });
    if (!agent) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `Agent not found`,
      });
    }
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
    // update type in user model
    await userModel.findByIdAndUpdate(
      userId,
      { $set: { accountType: "client" } },
      { new: true }
    );
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Agent and associated properties deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
