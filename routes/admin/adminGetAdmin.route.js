import express from "express";
import upload from "../../funcs/cloudinary/upload.js";
import {
  AdminAddAdminImage,
  AdminEditAdminAccount,
  AdminGetAdmin,
  AdminToggleAdminIsActive,
  AdminToggleAdminIsApproved,
  getSingleAdmin,
} from "../../controllers/admin/AdminGetsAdmin.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

// ========get admin============
router.put("/", checkAdminRole([ROLES.Ceo]), AdminGetAdmin);

router.get("/:adminId", checkAdminRole([ROLES.Ceo]), getSingleAdmin);

// ============is admin isActive===========
router.put("/:adminId", checkAdminRole([ROLES.Ceo]), AdminToggleAdminIsActive);

// ============is admin isApproved===========
router.put(
  "/AdminToggleAdminIsApproved/:adminId",
  checkAdminRole([ROLES.Ceo]),
  AdminToggleAdminIsApproved
);

//edit admin account
router.put(
  "/AdminEditAdminAccount/account/:adminId",
  checkAdminRole([ROLES.Ceo]),
  AdminEditAdminAccount
);

// edit admin image
router.put(
  "/AdminAddAdminImage/image/addImage/:adminId",
  checkAdminRole([ROLES.Ceo]),
  upload.single("image"),
  AdminAddAdminImage
);

export default router;
