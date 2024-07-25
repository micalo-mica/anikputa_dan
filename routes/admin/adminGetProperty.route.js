import express from "express";
import upload from "../../funcs/cloudinary/upload.js";
import {
  AdminAddPropertyImg,
  AdminCreateProperty,
  AdminDeleteProperty,
  AdminEditProperty,
  AdminGetProperty,
  AdminGetPropertyImages,
  AdminGetSingleProperty,
  AdminRemovePropertyImg,
  AdminTogglePropertyAvailability,
  AdminTogglePropertyIsApproved,
} from "../../controllers/admin/AdminGetProperty.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

// ========get property============
router.put("/", checkAdminRole([...ROLES.All]), AdminGetProperty);

router.get(
  "/:propertyId",
  checkAdminRole([...ROLES.All]),
  AdminGetSingleProperty
);

//edit property
router.put("/:propertyId", checkAdminRole([...ROLES.All]), AdminEditProperty);

//get property property images
router.get(
  "/AdminGetPropertyImages/:propertyId",
  checkAdminRole([...ROLES.All]),
  AdminGetPropertyImages
);

//remove Property Img
router.post(
  "/AdminRemovePropertyImg/remove",
  checkAdminRole([...ROLES.All]),
  AdminRemovePropertyImg
);

//add Property Img
router.put(
  "/AdminAddPropertyImg/propertyImage/:propertyId",
  checkAdminRole([...ROLES.All]),
  upload.array("images"),
  AdminAddPropertyImg
);

//delete property
router.delete(
  "/:propertyId",
  checkAdminRole([...ROLES.All]),
  AdminDeleteProperty
);

// is property available
router.put(
  "/AdminTogglePropertyAvailability/available/toggle/:propertyId",
  checkAdminRole([...ROLES.All]),
  AdminTogglePropertyAvailability
);

//create property
router.post(
  "/",
  checkAdminRole([...ROLES.All]),
  upload.array("images"),
  AdminCreateProperty
);

// is property isApproved
router.put(
  "/AdminTogglePropertyIsApproved/:propertyId",
  checkAdminRole([...ROLES.All]),
  AdminTogglePropertyIsApproved
);

export default router;
