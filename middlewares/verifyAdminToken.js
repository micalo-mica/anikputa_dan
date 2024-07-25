import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import { StatusCodes } from "http-status-codes";

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: "You are not signed in",
    });
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ADMIN_JWT_KEY, (error, user) => {
      if (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          msg: "You are not authorized",
        });
      }

      req.adminId = payload.adminId;
      req.firstName = payload.firstName;
      req.lastName = payload.lastName;
      req.roles = payload.roles;
      // req.isActive = payload.isActive;
      next();
    });
  }
};

export const verifiedAndAuthorizedAdmin = (req, res, next) => {
  verifyAdminToken(req, res, async () => {
    const admin = await adminModel.findById(req.adminId).select("-dbPassword");
    if (!admin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You do not have the authorization",
      });
    }
    if (req.adminId !== admin._id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You do not have the authorization",
      });
    } else if (!admin.isApproved || !admin.isActivated) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Your account has not been approved or is not active",
      });
    } else {
      next();
    }
  });
};

// Middleware function to check if the user has any of the required roles
export const checkAdminRole = (allRoles) => async (req, res, next) => {
  const adminId = req.adminId; // Assuming you have adminId set in your request

  try {
    const admin = await adminModel.findById(adminId).select("-dbPassword");
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Admin not found",
      });
    }

    if (req.admin !== admin._id.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You do not have the authorization",
      });
    }

    if (!admin.isApproved || !admin.isActivated) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Your account has not been approved or is not active",
      });
    }

    const adminRoles = admin.roles;
    const intersection = allRoles.filter((role) => adminRoles.includes(role));

    if (intersection.length > 0) {
      // User has at least one of the required roles, proceed to the next middleware
      next();
    } else {
      // User doesn't have any of the required roles, return an error
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "You do not have the authorization",
      });
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// // Example route that requires any of the roles passed in roles.all array
// app.get('/all-roles', checkUserRole([...roles.all, roles.manager, roles.customerServices]), (req, res) => {
//   res.json({ message: 'All Roles route' });
// });

// // Middleware function to check if the user has the required role
// export const checkAdminRole = (role) => async (req, res, next) => {
//   const adminId = req.adminId; // Assuming you have adminId set in your request

//   try {
//     const admin = await adminModel.findById(adminId).select("-dbPassword");
//     if (!admin) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         msg: "Admin not found",
//       });
//     }

//     if (req.admin !== admin._id.toString()) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "You do not have the authorization",
//       });
//     }

//     if (!admin.isApproved || !admin.isActivated) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "Your account has not been approved or is not active",
//       });
//     }

//     if (admin.roles.includes(role)) {
//       // User has the required role, proceed to the next middleware
//       next();
//     } else {
//       // User doesn't have the required role, return an error
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "You do not have the authorization",
//       });
//     }
//   } catch (error) {
//     console.error("Error checking user role:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

// export const verifiedAndAuthorizedAdmin = (req, res, next) => {
//   verifyAdminToken(req, res, async () => {
//     const admin = await adminModel.findById(req.adminId).select("-dbPassword");
//     if (!admin) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "You do not have the authorization",
//       });
//     }
//     if (req.adminId === admin._id.toString()) {
//       next();
//     } else {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         msg: "You do not have the authorization",
//       });
//     }
//   });
// };
