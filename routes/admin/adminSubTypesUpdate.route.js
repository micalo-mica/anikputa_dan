import express from "express";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
import {
  adminGetAllUsersSubscriptionTypeData,
  createUsersSubscriptionTypeData,
  editUsersSubscriptionTypeData,
} from "../../controllers/admin/adminSubtypesUpdate.controller.js";
const router = express.Router();

// router.use(verifyAdminToken);

// create Users Subscription Type Data
router.post("/", createUsersSubscriptionTypeData);

// create Users Subscription Type Data
router.post(
  "/editUsersSubscriptionTypeData/:id",
  editUsersSubscriptionTypeData
);

//get a property  sold
router.get("/", adminGetAllUsersSubscriptionTypeData);

// //get all properties  sold
// router.post("/", checkAdminRole([...ROLES.All]), AdminGetSoldProperties);

export default router;
