import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import axios from "axios";

const { DOMAIN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } =
  process.env;

export const authGoogle = async (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${REDIRECT_URI}&client_id=${GOOGLE_CLIENT_ID}`;
  res.json({ authUrl });
};

export const authGoogleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const profileData = profileResponse.data;

    const email = profileData.email;

    const userEmail = await userModel.findOne({ email });

    const age = 1000 * 60 * 60 * 24 * 25;

    // good code
    if (!userEmail) {
      const accountData = {
        googleId: profileData.id,
        name: profileData.name,
        email: profileData.email,
        picture: profileData.picture,
        isVerified: true,
      };

      const newAccountData = new userModel(accountData);
      const newAccount = await newAccountData.save();

      // sign jwt token to the user
      const token = jwt.sign(
        {
          id: newAccount._id,
          name: newAccount.name,
          email: newAccount.email,
          accountType: newAccount.accountType,
          picture: newAccount.picture,
        },
        process.env.JWT_KEY,
        { expiresIn: age }
      );

      const SUCCESS_PAGE_URL = `${DOMAIN}/googleAuthenticationSuccess?token=${token}`;

      // // front end token
      // res.cookie("frontToken", token, {
      //   domain: DOMAIN,
      //   // httpOnly: true, //accessible only by web server
      //   // secure: true, //https
      //   sameSite: "None", //cross-site cookie
      //   maxAge: age, //cookie expiry: set to match rT
      // });

      // // Create secure cookie with refresh token
      // res.cookie("token", token, {
      //   domain: DOMAIN,
      //   httpOnly: true, //accessible only by web server
      //   // secure: true, //https
      //   sameSite: "None", //cross-site cookie
      //   maxAge: age, //cookie expiry: set to match rT
      // });

      // res.status(StatusCodes.OK).json({
      //   success: true,
      //   msg: "Authentication successful",
      //   token: token,
      //   accountType: user.accountType,
      // });
      //
      // // Redirect to home page
      // res.redirect(DOMAIN);
      // Redirect to frontend with token as URL parameter
      res.redirect(SUCCESS_PAGE_URL);
    } else {
      const accountData = {
        googleId: profileData.id,
        name: profileData.name,
        picture: profileData.picture,
      };

      const updatedAccount = await userModel.findOneAndUpdate(
        { email: email },
        { $set: accountData },
        { new: true }
      );

      // sign jwt token to the user
      const token = jwt.sign(
        {
          id: updatedAccount._id,
          accountType: updatedAccount.accountType,
          name: updatedAccount.name,
          email: updatedAccount.email,
          picture: updatedAccount.picture,
        },
        process.env.JWT_KEY,
        { expiresIn: age }
      );

      const SUCCESS_PAGE_URL = `${DOMAIN}/googleAuthenticationSuccess?token=${token}`;

      // Redirect to home page
      res.redirect(SUCCESS_PAGE_URL);
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
