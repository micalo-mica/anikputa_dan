import express from "express";
import {
  AdminGetSinglePropertySold,
  AdminGetSoldProperties,
  AdminTogglePropertiesSold,
  createAdminPropertiesSold,
} from "../../controllers/admin/adminPropertySold.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

//create sold
router.post(
  "/:propertyId",
  checkAdminRole([...ROLES.All]),
  createAdminPropertiesSold
);

//get all properties  sold
router.post("/", checkAdminRole([...ROLES.All]), AdminGetSoldProperties);

//get a property  sold
router.get(
  "/:soldId",
  checkAdminRole([...ROLES.All]),
  AdminGetSinglePropertySold
);

//toggle is sold for agent
router.put(
  "/:propertyId",
  checkAdminRole([...ROLES.All]),
  AdminTogglePropertiesSold
);

// ____________________________________________________________________________________________
// //get a property  sold
// router.get(
//   "/AdminGetParticularSinglePropertySoldDetails/single/:propertyId",
//   AdminGetSinglePropertySold
// );

// //count sold
// router.get("/getAdminTotalPropertySold/count", getOrantageTotalPropertySold);

export default router;
