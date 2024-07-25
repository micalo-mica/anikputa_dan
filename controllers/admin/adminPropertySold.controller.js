import { StatusCodes } from "http-status-codes";
import propertyModel from "../../models/property.model.js";
import soldModel from "../../models/sold.model.js";

export const createAdminPropertiesSold = async (req, res) => {
  const { propertyId } = req.params;

  try {
    let foundIsSold = await soldModel.findOne({ propertyId: propertyId });

    if (foundIsSold) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "You have update this property before",
      });
    }

    let property = await propertyModel.findById(propertyId);

    if (property.type === "rent" || property.type === "commercial") {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Type is not allow",
      });
    }

    let soldData = {};

    if (sellerType === "orantage") {
      soldData = {
        propertyId: property._id,
        sellerType: "orantage",
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        lga: property.lga,
        state: property.state,
        price: property.price,
      };
    } else if (sellerType === "agent") {
      soldData = {
        propertyId: property._id,
        sellerId: property.creatorId,
        sellerType: "agent",
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        lga: property.lga,
        state: property.state,
        price: property.price,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid property type" });
    }

    const soldProperty = new soldModel(soldData);
    await soldProperty.save();

    // update property
    property.isSold = true;
    await property.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminGetSoldProperties = async (req, res) => {
  const { propertyId, sellerId, name, sellerType, type, address, city, state } =
    req.body;

  const filters = {
    ...(propertyId && { propertyId: propertyId }),
    ...(sellerId && { sellerId: sellerId }),
    ...(sellerType && { sellerType: sellerType }),
    ...(name && {
      name: { $regex: name, $options: "i" },
    }),
    // ...(agentFirstName && {
    //   "agent.agentFirstName": { $regex: agentFirstName, $options: "i" },
    // }),
    // ...(agentLastName && {
    //   "agent.agentLastName": { $regex: agentLastName, $options: "i" },
    // }),
    ...(address && {
      address: { $regex: address, $options: "i" },
    }),
    ...(city && {
      city: { $regex: city, $options: "i" },
    }),
    ...(state && {
      state: { $regex: state, $options: "i" },
    }),
    ...(type && { type: type }),
  };

  try {
    const soldProperties = await soldModel.find(filters);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Properties not found",
      soldProperties,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminGetSinglePropertySold = async (req, res) => {
  const { soldId } = req.params;

  try {
    const propertySold = await soldModel.findById(soldId);
    if (!propertySold) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property sold not found" });
    }

    const propertyId = propertySold.propertyId;

    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property found",
      propertySold,
      property,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// toggle is sold for agent
export const AdminTogglePropertiesSold = async (req, res) => {
  const { propertyId } = req.params;
  const { type, email } = req.body;

  try {
    let property = await propertyModel.findById(propertyId);

    if (
      !property ||
      property.type === "rent" ||
      property.type === "commercial"
    ) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Type is not allow or property not found",
      });
    }
    // find user
    const userId = property.creatorId;
    const user = await userModel.findById(userId);

    if (!user || user.email !== email) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "User is not the owner of the property",
      });
    }

    // if condition
    if (type === false) {
      let foundIsSold = await soldModel.findOne({ propertyId: propertyId });
      // if property not found
      if (!foundIsSold) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          msg: "NOt found",
        });
      }

      // update property
      const property = await propertyModel.findByIdAndUpdate(
        propertyId,
        { isSold: false },
        { new: true }
      );

      // delete sold property data
      await soldModel.findOneAndDelete({ propertyId: propertyId });
      // return something
      res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Updated successfully",
      });
      //
    } else if (type === true) {
      let foundIsSold = await soldModel.findOne({ propertyId: propertyId });

      if (foundIsSold) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          success: false,
          msg: "You have update this property before",
        });
      }

      const soldData = {
        propertyId: property._id,
        sellerId: property.creatorId,
        sellerType: "agent",
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.city,
        lga: property.lga,
        state: property.state,
        price: property.price,
      };
      // save
      const soldProperty = new soldModel(soldData);
      await soldProperty.save();

      // update property
      property.isSold = true;
      await property.save();

      res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Updated successfully",
      });
    } else {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Invalid and property not toggled or update",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ________________________________not used______________________________________

// export const AdminGetParticularSinglePropertySoldDetails = async (req, res) => {
//   const { propertyId } = req.params;

//   try {
//     const property = await propertyModel.findById(propertyId);
//     if (!property) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: false, msg: "Property sold not found" });
//     }

//     res.status(StatusCodes.OK).json({
//       success: true,
//       msg: "Property found",
//       property,
//     });
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

// // Route to get total number of properties listed by orantage
// export const getOrantageTotalPropertySold = async (req, res) => {
//   try {
//     const totalSold = await soldModel.countDocuments({
//       sellerType: "orantage",
//     });

//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       msg: "Total properties gotten successfully",
//       totalSold,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };
