import express from "express";
import upload from "../../funcs/cloudinary/upload.js";
import {
  AdminAddAgentImage,
  AdminEditAgentAccount,
  AdminGetAgents,
  IsAgentActive,
  IsAgentApproved,
  IsAgentVerified,
  allUnapprovedAgents,
  getSingleAgent,
} from "../../controllers/admin/adminGetsAgents.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

// ========get user============
router.put("/", checkAdminRole([...ROLES.All]), AdminGetAgents);

router.get("/:userId", checkAdminRole([...ROLES.All]), getSingleAgent);

//edit agent account
router.put("/:userId", checkAdminRole([...ROLES.All]), AdminEditAgentAccount);

// edit agent account
router.put(
  "/addImage/:userId",
  checkAdminRole([...ROLES.All]),
  upload.single("image"),
  AdminAddAgentImage
);

// all Unapproved agent
router.get("/", checkAdminRole([...ROLES.All]), allUnapprovedAgents);

// Is agent Verified
router.patch(
  "/IsAgentVerified/:userId",
  checkAdminRole([...ROLES.All]),
  IsAgentVerified
);

// Is agent active
router.patch(
  "/IsAgentActive/active/:userId",
  checkAdminRole([...ROLES.All]),
  IsAgentActive
);

// Is agent Approved
router.patch(
  "/IsAgentApproved/is/approved/:userId",
  checkAdminRole([...ROLES.All]),
  IsAgentApproved
);

export default router;
