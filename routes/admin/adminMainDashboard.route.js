import express from "express";
import {
  getAllClients,
  getSingleClient,
  getUnapprovedUsersCount,
} from "../../controllers/admin/AdminDashboard.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

// ************remember to protect it with Ceo**************

// ===========get seller============
router.get("/", checkAdminRole([...ROLES.All]), getAllClients);

router.get("/:id", checkAdminRole([...ROLES.All]), getSingleClient);

// total unapproved users
router.get(
  "/getUnapprovedUsersCount/count",
  checkAdminRole([...ROLES.All]),
  getUnapprovedUsersCount
);

export default router;
