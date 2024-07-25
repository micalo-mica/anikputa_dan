import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model.js";
import agentModel from "../models/agent.model.js";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) return res.status(401).json({ message: "Not Authenticated!" });

//   jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
//     if (error) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "Token is not Valid!",
//       });
//     }
//     //
// req.userId = payload.id;
// req.name = payload.name;
// req.email = payload.email;
// req.accountType = payload.accountType;

//     next();
//   });
// };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: "You are not sign in",
    });
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (error, payload) => {
      if (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          msg: "Please sign in to access this",
        });
      }
      req.userId = payload.id;
      req.name = payload.name;
      req.email = payload.email;
      req.accountType = payload.accountType;
      next();
    });
  }
};

export const verifyAndAuthorization = (req, res, next) => {
  if (
    req.accountType === "client" ||
    req.accountType === "owner" ||
    req.accountType === "agent" ||
    req.accountType === "company"
  ) {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "Please sign in to access this",
    });
  }
};

// for client
export const verifyClient = (req, res, next) => {
  if (req.accountType === "client") {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You do not have the authorization",
    });
  }
};

// for owner
export const verifyOwner = (req, res, next) => {
  if (req.accountType === "owner") {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You do not have owner account, you must create owner account before your can list your property for rent. We can help your list your property?",
    });
  }
};

// for agent
export const verifyAgent = (req, res, next) => {
  if (req.accountType === "agent") {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You do not have the authorization",
    });
  }
};

// for company
export const verifyCompany = (req, res, next) => {
  if (req.userType === "company") {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You do not have the authorization",
    });
  }
};

export const verifyAgentAndCompany = (req, res, next) => {
  if (req.accountType === "agent" || req.accountType === "company") {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You do not have the authorization",
    });
  }
};

// agent company and owner
export const verifyAgentAndCompanyAndOwner = (req, res, next) => {
  if (
    req.accountType === "owner" ||
    req.accountType === "agent" ||
    req.accountType === "company"
  ) {
    next();
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You do not have the authorization",
    });
  }
};

// isApproved
export const verifyIsApproved = async (req, res, next) => {
  const agent = await agentModel.findOne({ userId: req.userId });
  if (!agent) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You did not have allow account",
    });
  }
  if (agent.accountType === "agent" && !agent.isApproved) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "Your account has not been approved",
    });
  } else {
    next();
  }
};
// // isApproved
// export const verifyIsApproved = async (req, res, next) => {
//   const agent = await agentModel.findOne({ userId: req.userId });
//   if (!agent) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       success: false,
//       msg: "You did not have allow account",
//     });
//   } else if (!agent.isApproved) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       success: false,
//       msg: "Your account has not been approved",
//     });
//   } else {
//     next();
//   }
// };

// isVerified
export const verifyIsVerified = async (req, res, next) => {
  const agent = await agentModel.findOne({ userId: req.userId });
  console.log(agent);
  if (!agent) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "You did not have allow account",
    });
  } else if (agent.accountType === "agent" && !agent.isVerified) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      msg: "Your account has not been Verified",
    });
  } else {
    next();
  }
};
