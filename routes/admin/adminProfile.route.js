import express from "express";
import { getAdminProfile } from "../../controllers/admin/adminProfile.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();
router.use(verifyAdminToken);

//get agent profile
router.get("/", checkAdminRole([...ROLES.All]), getAdminProfile);

// //edit profile for agent
// router.post("/editAgentProfile", verifyAgentAndCompany, editAgentProfile);

// //add image for agent
// router.put(
//   "/addImage",
//   verifyAgentAndCompany,
//   upload.single("image"),
//   addImage
// );

export default router;
