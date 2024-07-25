import express from "express";
import {
  AdminEditUserAccount,
  AdminGetUsers,
  getSingleUser,
} from "../../controllers/admin/adminGetsUsers.controller.js";
import upload from "../../funcs/cloudinary/upload.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

// ========get user============
router.put("/", checkAdminRole([...ROLES.All]), AdminGetUsers);

router.get("/:userId", checkAdminRole([...ROLES.All]), getSingleUser);

//edit user account
router.put("/:userId", checkAdminRole([...ROLES.All]), AdminEditUserAccount);

// edit user account
// router.put("/addImage/:userId", upload.single("image"), AdminAddImage);

export default router;
