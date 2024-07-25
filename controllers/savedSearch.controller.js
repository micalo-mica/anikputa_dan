import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import userModel from "../models/user.model.js";
import savedSearchModel from "../models/savedSearch.model.js";

export const saveProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const dbProperty = await propertyModel.findById(propertyId);
    let propertyData = {
      clientId: req.userId,
      propertyId: propertyId,
      type: dbProperty.type,
      category: dbProperty.category,
      price: dbProperty.price,
      bedrooms: dbProperty.bedrooms,
      bathrooms: dbProperty.bathrooms,
      coverImageUrl: dbProperty.coverImageUrl,
      city: dbProperty.city,
      state: dbProperty.state,
    };
    const saved = await savedSearchModel.findOne({
      propertyId: propertyId,
      clientId: req.userId,
    });
    if (saved) {
      await savedSearchModel.findOneAndDelete({
        propertyId: propertyId,
        clientId: req.userId,
      });

      return res
        .status(StatusCodes.OK)
        .json({ success: false, msg: "Saved property removed" });
    } else {
      const newSearch = new savedSearchModel(propertyData);
      await newSearch.save();

      res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Property saved successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getSavedProperty = async (req, res) => {
  try {
    const savedSearch = await savedSearchModel.find({
      clientId: req.userId,
    });

    if (!savedSearch) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Could not find saved property" });
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Property saved successfully",
      savedSearch,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const isSaved = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const saved = await savedSearchModel.findOne({
      propertyId: propertyId,
      clientId: req.userId,
    });

    if (saved) {
      return res.status(StatusCodes.OK).json({ msg: true });
    } else {
      return res.status(StatusCodes.OK).json({ msg: false });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const deleteSavedProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const savedSearch = await savedSearchModel.findById(id);
    // check
    if (!savedSearch) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Could not delete this property" });
    }
    // check if it is the owner
    if (savedSearch.clientId.toString() !== req.userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "You can not remove this property" });
    }
    // delete
    await savedSearchModel.findByIdAndDelete(id);
    //  return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
