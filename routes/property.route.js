import express from "express";
import {
  EditCoverImage,
  addPropertyImg,
  createProperty,
  deleteProperty,
  editProperty,
  getPropertyCoords,
  getPropertyImages,
  removePropertyImg,
  togglePropertyAvailability,
  updatePropertyCoords,
} from "../controllers/property.controller.js";
import upload from "../funcs/cloudinary/upload.js";
import {
  verifyIsApproved,
  verifyToken,
  verifyAgentAndCompany,
} from "../middlewares/verifyToken.js";
const router = express.Router();
router.use(verifyToken);

//create property
router.post(
  "/",
  verifyAgentAndCompany,
  verifyIsApproved,
  // upload.array("images"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  createProperty
);

// edit Property
router.put(
  "/editProperty/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  editProperty
);

//get Property Img
router.get(
  "/getPropertyImages/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  getPropertyImages
);

//remove Property Img
router.put(
  "/removePropertyImg/propertyImage/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  removePropertyImg
);

//add Property Img
router.post(
  "/addPropertyImg/propertyImage/add/many/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  upload.array("images"),
  addPropertyImg
);

//edit Property cover image
router.put(
  "/EditCoverImage/property/edit/cover/image/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  upload.single("coverImage"),
  EditCoverImage
);

// get property lat and long
router.get(
  "/getPropertyCoords/coords/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  getPropertyCoords
);

// Update property lat and long
router.patch(
  "/updatePropertyCoords/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  updatePropertyCoords
);

//delete property
router.delete(
  "/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  deleteProperty
);

// is property available
router.put(
  "/:propertyId",
  verifyAgentAndCompany,
  verifyIsApproved,
  togglePropertyAvailability
);

export default router;
