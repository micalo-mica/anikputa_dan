import userModel from "../../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import propertyModel from "../../models/property.model.js";
import { removeFromCloudinary } from "../../funcs/cloudinary/cloudinay.js";
import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
import { v2 as cloudinary } from "cloudinary";
const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;

// cloudinary
cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

export const AdminGetProperty = async (req, res) => {
  const {
    name,
    agentFirstName,
    agentLastName,
    agentEmail,
    address,
    city,
    state,
    agentPhone,
    type,
  } = req.body;

  const filters = {
    ...(name && {
      name: { $regex: name, $options: "i" },
    }),
    ...(agentFirstName && {
      "agent.agentFirstName": { $regex: agentFirstName, $options: "i" },
    }),
    ...(agentLastName && {
      "agent.agentLastName": { $regex: agentLastName, $options: "i" },
    }),
    ...(agentEmail && {
      "agent.agentEmail": { $regex: agentEmail, $options: "i" },
    }),
    ...(address && {
      address: { $regex: address, $options: "i" },
    }),
    ...(city && {
      city: { $regex: city, $options: "i" },
    }),
    ...(state && {
      state: { $regex: state, $options: "i" },
    }),
    ...(agentPhone && { "agent.agentPhone": agentPhone }),
    ...(type && { type: type }),
  };

  try {
    const properties = await propertyModel.find(filters);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Properties found",
      properties,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminGetSingleProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Users found",
      property,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminEditProperty = async (req, res) => {
  const {
    name,
    type,
    category,
    price,
    bedrooms,
    bathrooms,
    meterType,
    address,
    city,
    state,
    lga,
    features,
    description,
    nearbyAmenities,
    highLight,
    completed,
    floors,
    // rent and commercial 3
    firstPayment,
    isPetFriendly,
    // buy
    yearBuilt,
    isFurnished,
    hasPool,
    hasGarage,
    hasGarden,
    // plot
    NoOfPlots,
    zoning,
    terrain,
    isAccessible,
    roadAccess,
  } = req.body;

  // property id
  const { propertyId } = req.params;

  try {
    const dbProperty = await propertyModel.findById(propertyId);

    // if (req.userId !== dbProperty.creatorId) {
    //   return res
    //     .status(StatusCodes.FORBIDDEN)
    //     .json({ success: false, msg: "You con only update your property" });
    // }

    let propertyData = {};

    if (type === "rent") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        category: category || dbProperty.category,
        price: price || dbProperty.price,
        bedrooms: bedrooms || dbProperty.bedrooms,
        bathrooms: bathrooms || dbProperty.bathrooms,
        meterType: meterType || dbProperty.meterType,
        floors: floors || dbProperty.floors,
        address: address || dbProperty.address,
        city: city || dbProperty.city,
        state: state || dbProperty.state,
        lga: lga || dbProperty.lga,
        features: features || dbProperty.features,
        description: description || dbProperty.description,
        nearbyAmenities: nearbyAmenities || dbProperty.nearbyAmenities,
        highLight: highLight || dbProperty.highLight,
        completed: completed || dbProperty.completed,
        firstPayment: firstPayment || dbProperty.firstPayment,
        isPetFriendly: isPetFriendly || dbProperty.isPetFriendly,
      };
    } else if (type === "plot") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        price: price || dbProperty.price,
        meterType: meterType || dbProperty.meterType,
        address: address || dbProperty.address,
        city: city || dbProperty.city,
        state: state || dbProperty.state,
        lga: lga || dbProperty.lga,
        description: description || dbProperty.description,
        nearbyAmenities: nearbyAmenities || dbProperty.nearbyAmenities,
        highLight: highLight || dbProperty.highLight,
        //
        "plot.NoOfPlots": NoOfPlots || dbProperty.plot.NoOfPlots,
        "plot.zoning": zoning || dbProperty.plot.zoning,
        "plot.terrain": terrain || dbProperty.plot.terrain,
        "plot.isAccessible": isAccessible || dbProperty.plot.isAccessible,
        "plot.roadAccess": roadAccess || dbProperty.plot.roadAccess,
      };
    } else if (type === "buy") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        category: category || dbProperty.category,
        price: price || dbProperty.price,
        bedrooms: bedrooms || dbProperty.bedrooms,
        bathrooms: bathrooms || dbProperty.bathrooms,
        meterType: meterType || dbProperty.meterType,
        address: address || dbProperty.address,
        city: city || dbProperty.city,
        state: state || dbProperty.state,
        lga: lga || dbProperty.lga,
        features: features || dbProperty.features,
        description: description || dbProperty.description,
        nearbyAmenities: nearbyAmenities || dbProperty.nearbyAmenities,
        highLight: highLight || dbProperty.highLight,
        completed: completed || dbProperty.completed,
        //
        "buy.yearBuilt": yearBuilt || dbProperty.buy.yearBuilt,
        "buy.isFurnished": isFurnished || dbProperty.buy.isFurnished,
        "buy.hasPool": hasPool || dbProperty.buy.hasPool,
        "buy.hasGarage": hasGarage || dbProperty.buy.hasGarage,
        "buy.hasGarden": hasGarden || dbProperty.buy.hasGarden,
      };
    } else if (type === "commercial") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        price: price || dbProperty.price,
        meterType: meterType || dbProperty.meterType,
        address: address || dbProperty.address,
        city: city || dbProperty.city,
        state: state || dbProperty.state,
        lga: lga || dbProperty.lga,
        description: description || dbProperty.description,
        features: features || dbProperty.features,
        nearbyAmenities: nearbyAmenities || dbProperty.nearbyAmenities,
        highLight: highLight || dbProperty.highLight,
        completed: completed || dbProperty.completed,
        firstPayment: firstPayment || dbProperty.firstPayment,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid property type" });
    }

    await propertyModel.findByIdAndUpdate(propertyId, propertyData, {
      new: true,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Property updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminGetPropertyImages = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const images = await propertyModel.findById(propertyId).select("images");

    if (!images) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Image deleted successfully",
      images,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminRemovePropertyImg = async (req, res) => {
  const { cloudinaryId } = req.body;
  console.log(cloudinaryId);
  try {
    if (!cloudinaryId) {
      return res.status(404).json({ error: "Image not found" });
    }

    const property = await propertyModel.findOne({
      "images.cloudinaryId": cloudinaryId,
    });

    if (!property) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = property.images.find(
      (img) => img.cloudinaryId === cloudinaryId
    );
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete image from Cloudinary
    await removeFromCloudinary(cloudinaryId);

    // Remove image from Property schema
    property.images = property.images.filter(
      (img) => img.cloudinaryId !== cloudinaryId
    );
    await property.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminAddPropertyImg = async (req, res) => {
  const { propertyId } = req.params;

  try {
    //  // Upload multiple images to Cloudinary
    //  const uploadPromises = images.map(async (image) => {
    //   const result = await cloudinary.uploader.upload(image);
    //   return {
    //     url: result.secure_url,
    //     cloudinaryId: result.public_id
    //   };
    // });

    // const uploadedImages = await Promise.all(uploadPromises);

    const uploadedImages = [];
    // Loop through uploaded files
    for (const file of req.files) {
      // Convert the file to Data URI format
      const dataUri = parser.format(file.originalname, file.buffer);
      // Upload file to Cloudinary
      // const result = await uploadImage(dataUri.content, "properties");
      const result = await cloudinary.uploader.upload(dataUri.content, {
        folder: "properties",
      });

      // Add image data to imagesData array
      uploadedImages.push({
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
      });
    }

    // Find and update the corresponding Property document
    const property = await propertyModel.findOneAndUpdate(
      { _id: propertyId },
      { $push: { images: { $each: uploadedImages } } },
      { new: true }
    );

    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Image added successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminDeleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    // Find and update the corresponding Property document
    const property = await propertyModel.findByIdAndDelete(propertyId);

    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Property successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ============is property available===========
export const AdminTogglePropertyAvailability = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Property not found" });
    }
    // update
    property.isAvailable = !property.isAvailable;
    await property.save();
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property availability toggled successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const AdminCreateProperty = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      price,
      bedrooms,
      bathrooms,
      meterType,
      address,
      city,
      state,
      lga,
      features,
      description,
      images,
      nearbyAmenities,
      highLight,
      completed,
      floors,
      // rent and commercial 3
      firstPayment,
      isPetFriendly,
      // buy
      yearBuilt,
      isFurnished,
      hasPool,
      hasGarage,
      hasGarden,
      // plot
      NoOfPlots,
      zoning,
      terrain,
      isAccessible,
      roadAccess,
    } = req.body;

    if (!type || !name || !lga || !address || !city || !state) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Some details are empty" });
    }

    // // Upload images to Cloudinary
    // const uploadedImages = await Promise.all(
    //   req.files.map(async (file) => {
    //     // const result = await cloudinary.uploader.upload(file.buffer);
    //     const image = file.buffer;
    //     console.log(image);
    //     const result = await uploadImage(image, "properties");
    //     return {
    //       url: result.url,
    //       cloudinaryId: result.public_id,
    //     };
    //   })
    // );

    const uploadedImages = [];
    // Loop through uploaded files
    for (const file of req.files) {
      // Convert the file to Data URI format
      const dataUri = parser.format(file.originalname, file.buffer);
      // Upload file to Cloudinary
      // const result = await uploadImage(dataUri.content, "properties");
      const result = await cloudinary.uploader.upload(dataUri.content, {
        folder: "properties",
      });

      // Add image data to imagesData array
      uploadedImages.push({
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
      });
    }

    // if (type === "rent" && (!meterType || meterType.trim() === "")) {
    //   return res
    //     .status(StatusCodes.NOT_ACCEPTABLE)
    //     .json({ message: "Meter type is required for rental properties" });
    // }

    // get user
    const creator = await adminModel.findById(req.userId);

    let propertyData = {};

    if (type === "rent") {
      propertyData = {
        creatorId: creator._id,
        type,
        images: uploadedImages,
        name,
        category,
        price,
        bedrooms,
        bathrooms,
        meterType,
        floors,
        address,
        city,
        state,
        lga,
        features,
        description,
        nearbyAmenities,
        highLight,
        completed,
        firstPayment,
        isPetFriendly,
        isOrantage: true,
        "agent.agentFirstName": creator.firstName,
        "agent.agentLastName": creator.lastName,
        "agent.agentEmail": creator.email,
        "agent.agentPhone": creator.phoneNumber,
      };
    } else if (type === "plot") {
      propertyData = {
        creatorId: creator._id,
        type,
        images: uploadedImages,
        name,
        price,
        meterType,
        address,
        city,
        state,
        lga,
        description,
        nearbyAmenities,
        highLight,
        isOrantage: true,
        "agent.agentFirstName": creator.firstName,
        "agent.agentLastName": creator.lastName,
        "agent.agentEmail": creator.email,
        "agent.agentPhone": creator.phoneNumber,
        //
        "plot.NoOfPlots": NoOfPlots,
        "plot.zoning": zoning,
        "plot.terrain": terrain,
        "plot.isAccessible": isAccessible,
        "plot.roadAccess": roadAccess,
      };
    } else if (type === "buy") {
      propertyData = {
        creatorId: creator._id,
        type,
        images: uploadedImages,
        name,
        category,
        price,
        bedrooms,
        bathrooms,
        meterType,
        address,
        city,
        state,
        lga,
        features,
        description,
        nearbyAmenities,
        highLight,
        completed,
        isOrantage: true,
        "agent.agentFirstName": creator.firstName,
        "agent.agentLastName": creator.lastName,
        "agent.agentEmail": creator.email,
        "agent.agentPhone": creator.phoneNumber,
        //
        "buy.yearBuilt": yearBuilt,
        "buy.isFurnished": isFurnished,
        "buy.hasPool": hasPool,
        "buy.hasGarage": hasGarage,
        "buy.hasGarden": hasGarden,
      };
    } else if (type === "commercial") {
      propertyData = {
        creatorId: creator._id,
        type,
        images: uploadedImages,
        name,
        price,
        meterType,
        address,
        city,
        state,
        lga,
        description,
        features,
        nearbyAmenities,
        highLight,
        completed,
        firstPayment,
        isOrantage: true,
        "agent.agentFirstName": creator.firstName,
        "agent.agentLastName": creator.lastName,
        "agent.agentEmail": creator.email,
        "agent.agentPhone": creator.phoneNumber,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid property type" });
    }

    const newProperty = new propertyModel(propertyData);
    await newProperty.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Property created successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ============is property isApproved===========
export const AdminTogglePropertyIsApproved = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await propertyModel.findById(propertyId);
    if (!property) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Property not found" });
    }
    // update
    property.isApproved = !property.isApproved;
    await property.save();
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property availability toggled successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
