import adminModel from "../../models/admin.model.js";
import { StatusCodes } from "http-status-codes";
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

export const AdminGetAdmin = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    phoneNumber,
    postalCode,
    roles,
    lga,
  } = req.body;

  const filters = {
    ...(email && { email: email }),
    ...(firstName && {
      firstName: { $regex: firstName, $options: "i" },
    }),
    ...(lastName && {
      lastName: { $regex: lastName, $options: "i" },
    }),
    ...(address && {
      address: { $regex: address, $options: "i" },
    }),
    ...(lga && { lga: { $regex: lga, $options: "i" } }),
    ...(city && { city: { $regex: city, $options: "i" } }),
    ...(state && { state: { $regex: state, $options: "i" } }),
    ...(phoneNumber && { phoneNumber: phoneNumber }),
    ...(postalCode && { postalCode: postalCode }),
  };
  try {
    const admins = await adminModel.find(filters);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Admin found",
      admins,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getSingleAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Admin not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "admin found",
      admin,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ============is admin isActive===========
export const AdminToggleAdminIsActive = async (req, res) => {
  const { adminId } = req.params;
  console.log(adminId);

  try {
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Admin not found" });
    }
    // update
    admin.isActive = !admin.isActive;
    await admin.save();
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Admin isActive toggled successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ============is admin isApproved===========
export const AdminToggleAdminIsApproved = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Admin not found" });
    }
    // update
    admin.isApproved = !admin.isApproved;
    await admin.save();
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Admin isActive toggled successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// *********************************************************
export const AdminEditAdminAccount = async (req, res) => {
  const {
    roles,
    firstName,
    lastName,
    address,
    lga,
    city,
    state,
    phoneNumber,
    postalCode,
    permissions,
    education,
    department,
    notes,
    relationship,
    gender,
    nextOfKinName,
    nextOfKinNumber,
    tasks,
  } = req.body;
  const { adminId } = req.params;
  console.log(adminId);

  try {
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "Admin not found" });
    }

    const dataToChange = {
      roles: roles || admin.roles,
      firstName: firstName || admin.firstName,
      lastName: lastName || admin.lastName,
      address: address || admin.address,
      lga: lga || admin.lga,
      city: city || admin.city,
      state: state || admin.state,
      phoneNumber: phoneNumber || admin.phoneNumber,
      postalCode: postalCode || admin.postalCode,
      permissions: permissions || admin.permissions,
      education: education || admin.education,
      department: department || admin.department,
      relationship: relationship || admin.relationship,
      gender: gender || admin.gender,
      nextOfKinName: nextOfKinName || admin.nextOfKinName,
      nextOfKinNumber: nextOfKinNumber || admin.nextOfKinNumber,
      tasks: tasks || admin.tasks,
      notes: notes || admin.notes,
    };

    await adminModel.findByIdAndUpdate(
      adminId,
      { $set: dataToChange },
      { new: true }
    );
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Info updated successfully" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminAddAdminImage = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Check if imageUrl and cloudinaryId exist and are not empty strings
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "User not found" });
    }

    if (admin.imageUrl && admin.cloudinaryId) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(user.cloudinaryId);
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
    admin.imageUrl = result.secure_url;
    admin.cloudinaryId = result.public_id;
    await admin.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
