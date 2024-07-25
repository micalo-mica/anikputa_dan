import agentModel from "../../models/agent.model.js";
import userModel from "../../models/user.model.js";
import { StatusCodes } from "http-status-codes";
// adminGetAgents

export const AdminGetAgents = async (req, res, next) => {
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    phone,
    accountType,
    companyName,
  } = req.body;

  const filters = {
    ...(accountType && { accountType: accountType }),

    ...(companyName && {
      companyName: { $regex: companyName, $options: "i" },
    }),
    ...(firstName && {
      firstName: { $regex: firstName, $options: "i" },
    }),
    ...(lastName && {
      lastName: { $regex: lastName, $options: "i" },
    }),
    ...(address && {
      address: { $regex: address, $options: "i" },
    }),
    ...(phone && {
      phone: { $regex: phone, $options: "i" },
    }),
    ...(city && { city: { $regex: city, $options: "i" } }),
    ...(state && { state: { $regex: state, $options: "i" } }),
  };
  try {
    const agents = await agentModel.find(filters);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Agents found",
      agents,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getSingleAgent = async (req, res) => {
  const userId = req.params.userId;
  try {
    const agent = await agentModel.findById(userId);
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Agent not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Agent found",
      agent,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminEditAgentAccount = async (req, res) => {
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
    education,
    specialty,
    experienceYears,
    bio,
    //owner
    note,
  } = req.body;
  const { userId } = req.params;

  try {
    const agent = await agentModel.findById(userId);
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }

    let dataToChange = {};

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
        specialties: specialty || agent.specialty,
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
        licenseNumber: licenseNumber || agent.licenseNumber,
        companyName: companyName || agent.companyName,
        industry: industry || agent.industry,
        servicesOffered: servicesOffered || agent.servicesOffered,
        //
      };
    } else if (accountType === "owner") {
      dataToChange = {
        firstName: firstName || agent.firstName,
        lastName: lastName || agent.lastName,
        address: address || agent.address,
        city: city || agent.city,
        state: state || agent.state,
        phoneNumber: phoneNumber || agent.phoneNumber,
        postalCode: postalCode || agent.postalCode,
        notes: note || agent.note,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid" });
    }

    await agentModel.findByIdAndUpdate(
      userId,
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

export const AdminAddAgentImage = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if imageUrl and cloudinaryId exist and are not empty strings
    const agent = await agentModel.findById(userId);

    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
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
      folder: "agent",
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

// all Unapproved agent
export const allUnapprovedAgents = async (req, res) => {
  try {
    const agents = await agentModel.find({
      isVerified: false,
      isApproved: false,
      isActive: false,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account gotten",
      agents,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// is agent verified
export const IsAgentVerified = async (req, res) => {
  const { userId } = req.params;

  try {
    const agent = await agentModel.findById(userId);

    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }

    agent.isVerified = !agent.isVerified;
    await agent.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Update successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// is agent active
export const IsAgentActive = async (req, res) => {
  const { userId } = req.params;

  try {
    const agent = await agentModel.findById(userId);

    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }

    agent.isActive = !agent.isActive;
    await agent.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Update successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// is agent approved
export const IsAgentApproved = async (req, res) => {
  const { userId } = req.params;

  try {
    const agent = await agentModel.findById(userId);

    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Agent not found" });
    }

    agent.isApproved = !agent.isApproved;
    await agent.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Update successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
