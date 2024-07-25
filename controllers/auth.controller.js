import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { activation, forgotToken } from "../utils/createToken.js";
import { validateEmail } from "../utils/validateEmail.js";
import userModel from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { genOtp } from "../utils/genPin.js";
import otpModel from "../models/otp.model.js";
import { sendOTPMail } from "../utils/emails/sendOTPMail.js";

// =====register=====
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check fields
    if (!name || !email || !password) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Some details are missing or invalid" });
    }
    // check email
    if (!validateEmail(email)) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Please enter a valid email address" });
    }
    // check password
    if (password.length < 6) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: `Password must be at least 6 characters.`,
      });
    }
    //check user
    const userEmail = await userModel.findOne({ email });
    // ************if email exist and is not verified******************
    if (userEmail && !userEmail.isVerified) {
      // find user and delete
      await otpModel.findOneAndDelete({ email: email });
      // find the otp with the email address and delete it, send new one
      await otpModel.findOneAndDelete({ email: email });
      // **************hash password*****************
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      // add user
      const userToSave = new userModel({
        name,
        email,
        dbPassword: hashPassword,
      });
      await userToSave.save();
      // gen otp
      const otp = genOtp();
      const newOtp = new otpModel({ email, otp });
      const savedOtp = await newOtp.save();
      // create token
      const user = {
        encodeEmail: savedOtp.email,
        encodeOtp: savedOtp.otp,
      };
      // activation_token
      const activation_token = activation(user);
      // send email
      sendOTPMail({
        email,
        otp,
        subject: "Please Verify Your Email Address",
      });
      // return
      return res.status(StatusCodes.OK).json({
        success: "resent_token",
        msg: `You have not verified your email, new OTP has been sent to your email`,
        verification_token: activation_token,
      });
    }
    // ************if email exist and verified******************
    else if (userEmail && userEmail.isVerified) {
      return res.status(StatusCodes.OK).json({
        success: "login_your_account",
        msg: `This email is already registered and verified in our system, login to you account.`,
      });
    } else {
      // **************hash password*****************
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      // add user
      const userToSave = new userModel({
        name,
        email,
        dbPassword: hashPassword,
      });
      await userToSave.save();
      // get otp
      const otp = genOtp();
      const newOtp = new otpModel({ email, otp });
      const savedOtp = await newOtp.save();
      // create token
      const user = {
        encodeEmail: savedOtp.email,
        encodeOtp: savedOtp.otp,
      };
      // activation_token
      const activation_token = activation(user);
      // send email
      sendOTPMail({
        email,
        otp,
        subject: "Please Verify Your Email Address",
      });
      // return
      res.status(StatusCodes.OK).json({
        success: "verify_your_account",
        msg: `please check your email for OTP and activate your account!`,
        verification_token: activation_token,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// =====verify user=====
export const verifyUser = async (req, res) => {
  try {
    // get token
    const { otp, verification_token } = req.body;

    if (!otp) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "No OTP" });
    }

    if (otp.length < 6) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "OTP must be at least 6 characters." });
    }
    // verify token
    const decodeUser = jwt.verify(
      verification_token,
      process.env.ACTIVATION_TOKEN
    );
    if (!decodeUser) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Your session token has expired or tampered with. Please go back to the Join page to obtain a new token and verify you account.",
      });
    }
    const { encodeEmail, encodeOtp } = decodeUser;
    // check email
    const findOtpEmail = await otpModel.findOne({ email: encodeEmail });
    // check if email exists
    if (!findOtpEmail) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Your session token has expired or tampered with. Please go back to the Join page to obtain a new token and verify you account.",
      });
    }
    // check if email is the same with the one in the token
    if (findOtpEmail.otp !== encodeOtp && findOtpEmail.email !== encodeEmail) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Invalid OTP or token has been tampered with, please try again",
      });
    }
    // check if email is the same with the one in the token
    if (findOtpEmail.otp !== otp) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Wrong OTP or was not sent to your email, please check your email and try again",
      });
    }
    // email
    const email = findOtpEmail.email;
    // delete otp
    await otpModel.findOneAndDelete({ email: encodeEmail });
    //  verify user
    const verifyUser = {
      isVerified: true,
    };
    await userModel.findOneAndUpdate(
      { email: email },
      { $set: verifyUser },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Account activated successfully, please log in",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// =====resend  OTP=====
export const resendOTP = async (req, res) => {
  try {
    // get token
    const { verification_token } = req.body;
    // check
    if (!verification_token) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "We can not get your verification token. Please go back to Join page to obtain a new token and verify your account.",
      });
    }
    // verify token
    const decodeUser = jwt.verify(
      verification_token,
      process.env.ACTIVATION_TOKEN
    );
    if (!decodeUser) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Your session token has expired or tampered with. Please go back to the Join page to obtain a new token and verify your account.",
      });
    }
    const { encodeEmail, encodeOtp } = decodeUser;
    const findOtpEmail = await otpModel.findOne({ email: encodeEmail });
    // check
    if (!findOtpEmail) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "We encountered problem resending OTP, pleas go back to Join page ",
      });
    }
    const email = findOtpEmail.email;
    // delete otp
    await otpModel.findOneAndDelete({ email: email });
    // get otp
    const otp = genOtp();
    const newOtp = new otpModel({ email, otp });
    const savedOtp = await newOtp.save();
    // create token
    const user = {
      encodeEmail: savedOtp.email,
      encodeOtp: savedOtp.otp,
    };
    // activation_token
    const activation_token = activation(user);
    // send email
    sendOTPMail({
      email,
      otp,
      subject: "Please Verify Your Email Address",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: `New OTP has been sent to your email`,
      verification_token: activation_token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// =====login=====
export const login = async (req, res) => {
  try {
    // get use credential
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Some details are missing or invalid" });
    }
    // check email in the db
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Wrong credential",
      });
    }
    // ***********************************
    const dbEmail = user.email;
    // check if is verified
    if (!user.isVerified) {
      // find the otp with the email address and delete it, send new one
      await otpModel.findOneAndDelete({ email: dbEmail });
      // get otp
      const otp = genOtp();
      const newOtp = new otpModel({ email: dbEmail, otp });
      const savedOtp = await newOtp.save();
      // create token
      const user = {
        encodeEmail: savedOtp.email,
        encodeOtp: savedOtp.otp,
      };
      // activation_token
      const activation_token = activation(user);
      // send email
      sendOTPMail({
        email: dbEmail,
        otp,
        subject: "Please Verify Your Email Address",
      });

      return res.status(StatusCodes.OK).json({
        success: "resent_token",
        msg: `You have not verified your email, new OTP has been sent to email: ${dbEmail}`,
        verification_token: activation_token,
      });
    } else {
      // compare password
      const isPasswordCorrect = await bcrypt.compare(password, user.dbPassword);
      if (!isPasswordCorrect) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          msg: "Wrong credential",
        });
      }
      const { dbPassword, ...info } = user._doc;
      //calc age
      const age = 1000 * 60 * 60 * 24 * 25;
      // sign jwt token to the user
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          accountType: user.accountType,
        },
        process.env.JWT_KEY,
        { expiresIn: age }
      );
      // return
      res.status(StatusCodes.OK).json({
        success: "verified",
        msg: "Your have login successfully",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// =====forgot password=====
export const forgot = async (req, res) => {
  try {
    // get email
    const { email } = req.body;
    // check email exist
    if (!email) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Enter your email address" });
    }
    // check email db
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Please provide the correct email",
      });
    }
    // get otp
    const otp = genOtp();
    const newOtp = new otpModel({ email, otp });
    const savedOtp = await newOtp.save();
    // create token
    const encodeUser = {
      encodeEmail: savedOtp.email,
      encodeOtp: savedOtp.otp,
    };
    // create ac token
    const forgot_token = forgotToken(encodeUser);
    // send email
    sendOTPMail({
      email,
      otp,
      subject: "Please Verify Your Email Address",
    });
    // success
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Please check your email",
      forgot_token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// =====reset=====
export const reset = async (req, res) => {
  try {
    // get password
    const { password, otp, forgot_token } = req.body;
    // check otp
    if (!otp) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "No OTP" });
    }
    // check password
    if (!password) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "Enter new password" });
    }
    // check forgot_token
    if (!forgot_token) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "We encountered problem resetting your password, please try again.",
      });
    }
    // verify token
    const decodeUser = jwt.verify(forgot_token, process.env.FORGOT_TOKEN);
    if (!decodeUser) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "Token invalid or expired" });
    }
    const { encodeEmail, encodeOtp } = decodeUser;
    // check if that user is available in db
    const foundOtp = await otpModel.findOne({ email: encodeEmail });
    const foundUser = await userModel.findOne({ email: encodeEmail });
    // if user not found
    if (!foundOtp) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `We did not send OTP to this ${email} email.`,
      });
    }
    // if user not found
    if (!foundUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `User not found.`,
      });
    }
    // check if email is the same with the one in the token
    if (foundOtp.otp !== encodeOtp && foundOtp.email !== encodeEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Invalid OTP or was not send to this email address",
      });
    }
    // check if email is the same with the one in the token
    if (foundOtp.otp !== otp) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Wrong OTP or was not sent to your email, please check your email and try again",
      });
    }
    // delete otp
    await otpModel.findOneAndDelete({ email: encodeEmail });
    // hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    // update password
    await userModel.findByIdAndUpdate(
      foundUser._id,
      {
        $set: { dbPassword: hashPassword },
      },
      { new: true }
    );
    // reset success
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Password was updated successfully, login.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// =====resend forgot OTP=====
export const resendForgotOTP = async (req, res) => {
  try {
    // get token
    const { forgot_token } = req.body;
    // check
    if (!forgot_token) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "We can not get your verification token. Please go back to Join page to obtain a new token and verify your account.",
      });
    }
    // verify token
    const decodeUser = jwt.verify(forgot_token, process.env.FORGOT_TOKEN);
    if (!decodeUser) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "Your session token has expired or tampered with. Please go back and enter your email address again to obtain a new token and reset your account.",
      });
    }
    const { encodeEmail, encodeOtp } = decodeUser;
    const findOtpEmail = await otpModel.findOne({ email: encodeEmail });
    // check
    if (!findOtpEmail) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "We encountered problem resending OTP, pleas go back to Join page ",
      });
    }
    const email = findOtpEmail.email;
    // delete otp
    await otpModel.findOneAndDelete({ email: email });
    // get otp
    const otp = genOtp();
    const newOtp = new otpModel({ email, otp });
    const savedOtp = await newOtp.save();
    // create token
    const encodeUser = {
      encodeEmail: savedOtp.email,
      encodeOtp: savedOtp.otp,
    };
    // activation_token
    const forgot_tokenToSend = forgotToken(encodeUser);
    // send email
    sendOTPMail({
      email,
      otp,
      subject: "Please Verify Your Email Address",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: `New OTP has been sent to your email`,
      forgot_token: forgot_tokenToSend,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
