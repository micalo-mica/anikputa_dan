import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model.js";
import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
import { v2 as cloudinary } from "cloudinary";
import agentModel from "../models/agent.model.js";

const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;

// cloudinary
cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

export const getAgentProfile = async (req, res) => {
  try {
    const profile = await agentModel.findOne({ userId: req.userId });
    // return
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

export const editAgentProfile = async (req, res) => {
  const {
    accountType,
    firstName,
    lastName,
    address,
    city,
    state,
    phoneNumber,
    postalCode,
    licenseNumber,
    //company
    companyName,
    industry,
    servicesOffered,
    // agent
    experienceYears,
    specialty,
    education,
    bio,
  } = req.body;
  try {
    const agent = await agentModel.findOne({ userId: req.userId });
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }
    // agent id
    const agentId = agent._id;
    let dataToChange = {};
    // if statement
    if (accountType === "agent") {
      dataToChange = {
        firstName: firstName || agent.firstName,
        lastName: lastName || agent.lastName,
        address: address || agent.address,
        city: city || agent.city,
        state: state || agent.state,
        phoneNumber: phoneNumber || agent.phoneNumber,
        postalCode: postalCode || agent.postalCode,
        licenseNumber: licenseNumber || agent.licenseNumber,
        experienceYears: experienceYears || agent.experienceYears,
        specialty: specialty || agent.specialty,
        education: education || agent.education,
        bio: bio || agent.bio,
      };
    } else if (accountType === "company") {
      dataToChange = {
        firstName: firstName || agent.firstName,
        lastName: lastName || agent.lastName,
        address: address || agent.address,
        city: city || agent.city,
        state: state || agent.state,
        phoneNumber: phoneNumber || agent.phoneNumber,
        postalCode: postalCode || agent.postalCode,
        companyName: companyName || agent.companyName,
        industry: industry || agent.industry,
        servicesOffered: servicesOffered || agent.servicesOffered,
        //
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid" });
    }
    // update now
    await agentModel.findByIdAndUpdate(
      agentId,
      { $set: dataToChange },
      { new: true }
    );
    // return
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

export const addImage = async (req, res) => {
  try {
    // Check if imageUrl and cloudinaryId exist and are not empty strings
    const agent = await agentModel.findOne({ userId: req.userId });
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }
    // check if is verified user
    if (agent.isVerified) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        msg: "You can not change ID after verification",
      });
    }
    // cloudinary
    if (agent.imageUrl && agent.cloudinaryId) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(agent.cloudinaryId);
    }
    // Upload new image to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path);
    const file = req.file;
    const dataUri = parser.format(file.originalname, file.buffer);
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "ID",
    });

    // Save Cloudinary URL and ID to MongoDB
    agent.imageUrl = result.secure_url;
    agent.cloudinaryId = result.public_id;
    await agent.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ================owner=================
// get owner profile
export const getOwnerProfile = async (req, res) => {
  try {
    const profile = await agentModel.findOne({ userId: req.userId });

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

export const editOwnerProfile = async (req, res) => {
  const {
    accountType,
    firstName,
    lastName,
    address,
    city,
    state,
    phoneNumber,
    postalCode,
    note,
  } = req.body;
  try {
    const agent = await agentModel.findOne({ userId: req.userId });
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }
    // id
    const agentId = agent._id;
    let dataToChange = {};
    // if statement
    if (accountType === "owner") {
      dataToChange = {
        firstName: firstName || agent.firstName,
        lastName: lastName || agent.lastName,
        address: address || agent.address,
        city: city || agent.city,
        state: state || agent.state,
        phoneNumber: phoneNumber || agent.phoneNumber,
        postalCode: postalCode || agent.postalCode,
        note: note || agent.note,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid" });
    }
    // update
    await agentModel.findByIdAndUpdate(
      agentId,
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

export const addOwnerImage = async (req, res) => {
  try {
    // Check if imageUrl and cloudinaryId exist and are not empty strings
    const agent = await agentModel.findOne({ userId: req.userId });
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }
    // if verified
    if (agent.isVerified) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        msg: "You can not change ID after verification",
      });
    }

    if (agent.imageUrl && agent.cloudinaryId) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(agent.cloudinaryId);
    }

    // Upload new image to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path);
    const file = req.file;
    const dataUri = parser.format(file.originalname, file.buffer);
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "ID",
    });

    // Save Cloudinary URL and ID to MongoDB
    agent.imageUrl = result.secure_url;
    agent.cloudinaryId = result.public_id;
    await agent.save();
    // return
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
