import express from "express";
const router = express.Router();
import {
  GenerateAdminToken,
  generateForgotPasswordToken,
  loginAdmin,
  registerAndActivateAccount,
  resetPasswordAdmin,
} from "../../controllers/admin/adminAuth.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";

router.post("/GenerateAdminToken", GenerateAdminToken);
router.post("/registerAndActivateAccount", registerAndActivateAccount);
router.post("/loginAdmin", loginAdmin);
router.post(
  "/generateForgotPasswordToken",
  verifyAdminToken,
  checkAdminRole([ROLES.Ceo]),
  generateForgotPasswordToken
);
router.post("/resetPasswordAdmin", resetPasswordAdmin);

export default router;
