import express from "express";
import upload from "../funcs/cloudinary/upload.js";
import {
  verifyIsApproved,
  verifyIsVerified,
  verifyOwner,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  EditOwnerCoverImage,
  addOwnerPropertyImg,
  deleteOwnerProperty,
  editOwnerProperty,
  getOwnerPropertyImages,
  ownerGetPropertyCoords,
  ownerLIstProperty,
  ownerUpdatePropertyCoords,
  removeOwnerPropertyImg,
  toggleOwnerPropertyAvailability,
} from "../controllers/ownerListProperty.controller.js";

const router = express.Router();
router.use(verifyToken);

//ownerLIstProperty
router.post(
  "/",
  verifyOwner,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  ownerLIstProperty
);

// edit Owner Property
router.put("/editOwnerProperty/:propertyId", verifyOwner, editOwnerProperty);

//get Owner Property Images
router.get(
  "/getOwnerPropertyImages/:propertyId",
  verifyOwner,
  getOwnerPropertyImages
);

//remove owner Property Img
router.put(
  "/removeOwnerPropertyImg/propertyImage/:propertyId",
  verifyOwner,
  removeOwnerPropertyImg
);

//add Property Img
router.put(
  "/addOwnerPropertyImg/propertyImage/add/:propertyId",
  verifyOwner,
  upload.array("images"),
  addOwnerPropertyImg
);

//edit Property cover image
router.put(
  "/EditOwnerCoverImage/property/edit/cover/image/:propertyId",
  verifyOwner,
  upload.single("coverImage"),
  EditOwnerCoverImage
);

// get property lat and long
router.get(
  "/ownerGetPropertyCoords/coords/:propertyId",
  verifyOwner,
  ownerGetPropertyCoords
);

// Update property lat and long
router.patch(
  "/ownerUpdatePropertyCoords/:propertyId",
  verifyOwner,
  ownerUpdatePropertyCoords
);

//delete owner property
router.delete("/:propertyId", verifyOwner, deleteOwnerProperty);

// is property available
router.put("/:propertyId", verifyOwner, toggleOwnerPropertyAvailability);

export default router;
