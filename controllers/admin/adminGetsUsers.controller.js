import userModel from "../../models/user.model.js";
import { StatusCodes } from "http-status-codes";

export const AdminGetUsers = async (req, res, next) => {
  const { name, email, accountType } = req.body;

  const filters = {
    ...(accountType && { accountType: accountType }),
    ...(email && { email: email }),
    ...(name && {
      name: { $regex: name, $options: "i" },
    }),
  };
  try {
    const users = await userModel.find(filters);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Users found",
      users,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Users found",
      user,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminEditUserAccount = async (req, res) => {
  const { accountType } = req.body;
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: true, msg: "User not found" });
    }

    const dataToChange = { accountType: accountType };

    await userModel.findByIdAndUpdate(
      userId,
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

// export const AdminAddImage = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     // Check if imageUrl and cloudinaryId exist and are not empty strings
//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: true, msg: "User not found" });
//     }

//     if (user.imageUrl && user.cloudinaryId) {
//       // Delete old image from Cloudinary
//       await cloudinary.uploader.destroy(user.cloudinaryId);
//     }

//     // Upload new image to Cloudinary
//     // const result = await cloudinary.uploader.upload(req.file.path);
//     const file = req.file;
//     const dataUri = parser.format(file.originalname, file.buffer);
//     // Upload file to Cloudinary
//     const result = await cloudinary.uploader.upload(dataUri.content, {
//       folder: "agent",
//     });

//     // Save Cloudinary URL and ID to MongoDB
//     user.imageUrl = result.secure_url;
//     user.cloudinaryId = result.public_id;
//     await user.save();

//     res
//       .status(StatusCodes.OK)
//       .json({ success: true, msg: "Image uploaded successfully" });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

// all Unapproved Users

// export const AdminGetFoods = async (req, res, next) => {
//   const q = req.body;
//   const filters = {
//     ...(q.businessId && { businessId: q.businessId }),
//     ...(q.sellerId && { sellerId: q.sellerId }),
//     ...(q.businessName && {
//       businessName: { $regex: q.businessName, $options: "i" },
//     }),
//     ...(q.businessAddress && {
//       businessAddress: { $regex: q.businessAddress, $options: "i" },
//     }),
//     ...(q.businessLocation && {
//       businessLocation: { $regex: q.businessLocation, $options: "i" },
//     }),
//     ...(q.businessState && {
//       businessState: { $regex: q.businessState, $options: "i" },
//     }),
//     ...(q.foodName && { foodName: { $regex: q.foodName, $options: "i" } }),
//     ...(q.category && { category: { $regex: q.category, $options: "i" } }),
//     ...(q.cuisine && { cuisine: { $regex: q.cuisine, $options: "i" } }),
//   };
//   try {
//     const foods = await foodModel.find(filters);
//     res.status(200).json(foods);
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: "Your request could not be processed. Please try again" });
//   }
// };

// export const getSingleFood = async (req, res, next) => {
//   try {
//     const food = await foodModel.findById(req.params.id).select("-ddPassword");
//     if (!food) {
//       return res.status(StatusCodes.NOT_FOUND).json("Food not found");
//     }

//     res.status(StatusCodes.OK).json(food);
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: "Your request could not be processed. Please try again" });
//   }
// };

// // ===================get order====================

// export const AdminGetOrders = async (req, res, next) => {
//   const q = req.body;
//   const filters = {
//     ...(q.payId && { payId: q.payId }),
//     ...(q.userId && { userId: q.userId }),
//     ...(q.sellerId && { sellerId: q.sellerId }),
//     ...(q.businessId && { businessId: q.businessId }),
//     ...(q.businessName && {
//       businessName: { $regex: q.businessName, $options: "i" },
//     }),
//   };
//   try {
//     const foods = await orderModel.find(filters);
//     res.status(StatusCodes.OK).json(foods);
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: "Your request could not be processed. Please try again" });
//   }
// };

// export const getSingleOrder = async (req, res, next) => {
//   try {
//     const order = await orderModel
//       .findById(req.params.id)
//       .select("-ddPassword");
//     if (!order) {
//       return res.status(StatusCodes.NOT_FOUND).json("Order not found");
//     }

//     res.status(StatusCodes.OK).json(food);
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: "Your request could not be processed. Please try again" });
//   }
// };
