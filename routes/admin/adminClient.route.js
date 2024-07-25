import express from "express";
const router = express.Router();
import {
  editClient,
  getAllFullClients,
} from "../../controllers/admin/AdminClient.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";

router.use(verifyAdminToken);

router.put("/:clientId", checkAdminRole([...ROLES.All]), editClient);

// get All Full Clients
router.get("/", checkAdminRole([...ROLES.All]), getAllFullClients);

export default router;
