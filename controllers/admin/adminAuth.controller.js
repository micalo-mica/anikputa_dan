import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { adminForgotToken } from "../../utils/createToken.js";
import { sendEmail } from "../../utils/sendMails.js";
import adminModel from "../../models/admin.model.js";

export const GenerateAdminToken = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    address,
    city,
    postalCode,
    education,
    state,
    lga,
    roles,
    gender,
    nextOfKinName,
    nextOfKinNumber,
    relationship,
    permissions,
    tasks,
    phoneNumber,
  } = req.body;
  // check fields

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !roles ||
    !address ||
    !city ||
    !postalCode ||
    !state ||
    !lga ||
    !education ||
    !nextOfKinName ||
    !nextOfKinNumber ||
    !gender ||
    !relationship ||
    !permissions ||
    !tasks
  ) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      msg: "Some details are missing or all fields please",
    });
  }

  // check email
  const adminEmail = await adminModel.findOne({ email });

  if (adminEmail) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      msg: `This email ${email} is already registered in our system.`,
    });
  }

  //   gen token
  const T = uuidv4();

  try {
    const newAdmin = new adminModel({
      employeeId: T,
      email,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      education,
      state,
      lga,
      roles,
      gender,
      nextOfKinName,
      nextOfKinNumber,
      relationship,
      permissions,
      tasks,
      phoneNumber,
    });

    const adminGen = await newAdmin.save();

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "EmployeeId generated",
      adminGen,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const registerAndActivateAccount = async (req, res) => {
  const { employeeId, email, password } = req.body;
  // check fields
  if (!employeeId || !email || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Some details are missing or invalid" });
  }
  try {
    // find user with the employeeId
    const foundAdmin = await adminModel.findOne({ employeeId, email });

    if (!foundAdmin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `We con not find a admin with this ${employeeId} and ${email} employeeId`,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const toSave = {
      isActivated: true,
      password: hash,
    };

    const newAdmin = await adminModel.findOneAndUpdate(
      { employeeId: employeeId },
      { $set: toSave },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account has been activated",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundAdmin = await adminModel.findOne({ email });

    if (!foundAdmin || !foundAdmin.isActivated) {
      return res.status(401).json({ message: "Unauthorized ee" });
    }

    const match = await bcrypt.compare(password, foundAdmin.password);

    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminToken = jwt.sign(
      {
        adminId: foundAdmin._id,
        firstName: foundAdmin.firstName,
        lastName: foundAdmin.lastName,
        email: foundAdmin.email,
        roles: foundAdmin.roles,
        isActivated: foundAdmin.isActivated,
      },
      process.env.ADMIN_JWT_KEY,
      { expiresIn: "1d" }
    );

    // Send accessToken containing username and roles
    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Good", adminToken: adminToken });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// gen token for forgot password
export const generateForgotPasswordToken = async (req, res, next) => {
  try {
    // get email
    const { email } = req.body;

    if (!email) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Enter your email address" });
    }

    // check email db
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Wrong credentials",
      });
    }

    //   gen token
    const T = uuidv4();

    // create ac token
    const restPasswordTokenToSave = { restPasswordToken: T };

    const adminAndTokenGen = await adminModel.findOneAndUpdate(
      { email: email },
      { $set: restPasswordTokenToSave },
      { new: true }
    );

    // success
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Token generated successfully",
      adminAndTokenGen,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// put new password
export const resetPasswordAdmin = async (req, res, next) => {
  const { password, restPasswordToken, email } = req.body;

  try {
    if (!password || !restPasswordToken || !email) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Some details are missing or invalid" });
    }

    // verify the token
    const foundToken = await adminModel.findOne({
      restPasswordToken: restPasswordToken,
      email: email,
    });
    if (!foundToken) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid token or email" });
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    foundToken.password = hashPassword;
    // set token empty
    foundToken.restPasswordToken = "";
    // save
    await foundToken.save();

    // // update password
    // const updatedAdmin = await adminModel.findOneAndUpdate(
    //   { restPasswordToken: restPasswordToken },
    //   {
    //     $set: { password: hashPassword },
    //   }
    // );

    // if (!updatedAdmin) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ success: false, msg: "Password not updated" });
    // }

    // // delete or set token to empty string
    // await adminModel.findOneAndUpdate(
    //   { restPasswordToken: restPasswordToken },
    //   {
    //     $set: { restPasswordToken: "" },
    //   }
    // );

    // reset success

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Password was updated successfully.",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// // forgot password
// export const forgotAdmin = async (req, res, next) => {
//   try {
//     // get email
//     const { email } = req.body;

//     if (!email) {
//       return res
//         .status(StatusCodes.NOT_ACCEPTABLE)
//         .json({ success: false, msg: "Enter your email address" });
//     }

//     // check email db
//     const admin = await adminModal.findOne({ email });
//     if (!admin) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "Wrong credentials",
//       });
//     }

//     // create ac token
//     const forgot_token = adminForgotToken({ id: admin._id });

//     // send email
//     const url = `${DOMAIN}/putNewPassword?token=${forgot_token}`;
//     sendEmail({
//       email,
//       url,
//       text: "Reset your password",
//     });

//     // success
//     res.status(StatusCodes.OK).json({
//       success: true,
//       msg: `Please check your email:- ${admin.email}`,
//     });
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

// // reset
// export const resetAdmin = async (req, res, next) => {
//   try {
//     // get password
//     const { password, token } = req.body;

//     if (!password || !token) {
//       return res
//         .status(StatusCodes.NOT_ACCEPTABLE)
//         .json({ success: false, msg: "Some details are missing or invalid" });
//     }

//     // verify the token
//     const newUser = jwt.verify(token, process.env.ADMIN_FORGOT_TOKEN);
//     if (!newUser) {
//       return res
//         .status(StatusCodes.NOT_ACCEPTABLE)
//         .json({ success: false, msg: "Some details are missing or invalid" });
//     }

//     // i can also use this to update user
//     const { id } = newUser;

//     // hash password
//     const salt = await bcrypt.genSalt();
//     const hashPassword = await bcrypt.hash(password, salt);

//     // update password
//     const updatedAdmin = await adminModal.findByIdAndUpdate(id, {
//       $set: { password: hashPassword },
//     });

//     if (!updatedAdmin) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: false, msg: "Admin not found" });
//     }

//     // reset success
//     res.status(StatusCodes.OK).json({
//       success: true,
//       msg: "Password was updated successfully.",
//     });
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };
