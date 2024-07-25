import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import { v4 as uuidv4 } from "uuid";
import {
  uploadImage,
  removeFromCloudinary,
} from "../funcs/cloudinary/cloudinay.js";
import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/user.model.js";
import agentModel from "../models/agent.model.js";
import weeklyCreatedPropertyModel from "../models/weeklyCreatedProperty.model.js";
import newlyCreatedPropertyModel from "../models/newlyCreatedProperty.model.js";
const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;

// cloudinary
cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

export const ownerLIstProperty = async (req, res) => {
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
      lat,
      long,
      nearbyAmenities,
      highLight,
      completed,
      floors,
      // rent and commercial 3
      firstPayment,
      // buy
      yearBuilt,
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
    // const images = req.files;
    const coverImage = req.files["coverImage"][0];
    const images = req.files["images"];
    // Check cover image
    if (!coverImage) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Please upload cover images." });
    }
    // Check if the number of images is between 5 and 8
    if (images.length < 4 || images.length > 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Please upload between 4 and 8 images." });
    }
    // Check if a property with the same name, address, state, and city exists
    const existingProperty = await propertyModel.findOne({
      name,
      address,
      lga,
      state,
      city,
    });
    if (existingProperty) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "A property with the same name, address, lga, state, and city already exists, you can contact support for clarifications.",
      });
    }
    //   gen token
    const T = uuidv4();
    // agent
    const agent = await agentModel.findOne({ userId: req.userId });

    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Agent not found" });
    }

    const creatorId = agent.userId;
    const agentId = agent._id;

    // Upload coverImage image to Cloudinary
    // const file = req.file;
    const dataUri = parser.format(coverImage.originalname, coverImage.buffer);
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "properties",
    });

    // Save Cloudinary URL and ID to MongoDB
    const coverImageUrl = result.secure_url;
    const coverImageCloudinaryId = result.public_id;

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
    for (const file of images) {
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

    let propertyData = {};

    if (type === "rent") {
      propertyData = {
        creatorId,
        agentId,
        visualId: T,
        type,
        images: uploadedImages,
        // cover image
        coverImageUrl: coverImageUrl,
        coverImageCloudinaryId: coverImageCloudinaryId,
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
        lat,
        long,
        nearbyAmenities,
        highLight,
        completed,
        firstPayment,
      };
    } else if (type === "plot") {
      propertyData = {
        creatorId,
        agentId,
        visualId: T,
        type,
        images: uploadedImages,
        // cover image
        coverImageUrl: coverImageUrl,
        coverImageCloudinaryId: coverImageCloudinaryId,
        name,
        price,
        meterType,
        address,
        city,
        state,
        lga,
        description,
        lat,
        long,
        nearbyAmenities,
        highLight,
        //
        "plot.NoOfPlots": NoOfPlots,
        "plot.zoning": zoning,
        "plot.terrain": terrain,
        "plot.isAccessible": isAccessible,
        "plot.roadAccess": roadAccess,
      };
    } else if (type === "buy") {
      propertyData = {
        creatorId,
        agentId,
        visualId: T,
        type,
        images: uploadedImages,
        // cover image
        coverImageUrl: coverImageUrl,
        coverImageCloudinaryId: coverImageCloudinaryId,
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
        lat,
        long,
        nearbyAmenities,
        highLight,
        completed,
        //
        "buy.yearBuilt": yearBuilt,
      };
    } else if (type === "commercial") {
      propertyData = {
        creatorId,
        agentId,
        visualId: T,
        type,
        images: uploadedImages,
        // cover image
        coverImageUrl: coverImageUrl,
        coverImageCloudinaryId: coverImageCloudinaryId,
        name,
        price,
        meterType,
        address,
        city,
        state,
        lga,
        description,
        lat,
        long,
        features,
        nearbyAmenities,
        highLight,
        completed,
        firstPayment,
      };
    } else {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Invalid property type" });
    }
    // create
    const newProperty = new propertyModel(propertyData);
    await newProperty.save();
    // add to new created property model
    const newCreatedProperty = new newlyCreatedPropertyModel({
      propertyId: newProperty._id,
    });
    await newCreatedProperty.save();
    // add it after property is created
    const weeklyCreatedProperty = new weeklyCreatedPropertyModel({
      propertyId: newProperty._id,
    });
    await weeklyCreatedProperty.save();
    // return
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Property created successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const editOwnerProperty = async (req, res) => {
  const {
    name,
    type,
    category,
    price,
    bedrooms,
    bathrooms,
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
    // buy
    yearBuilt,
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

    if (req.userId !== dbProperty.creatorId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "You con only update your property" });
    }

    let propertyData = {};

    if (type === "rent") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        category: category || dbProperty.category,
        price: price || dbProperty.price,
        bedrooms: bedrooms || dbProperty.bedrooms,
        bathrooms: bathrooms || dbProperty.bathrooms,
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
      };
    } else if (type === "plot") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        price: price || dbProperty.price,
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
      };
    } else if (type === "commercial") {
      propertyData = {
        type: type || dbProperty.type,
        name: name || dbProperty.name,
        price: price || dbProperty.price,
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
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getOwnerPropertyImages = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const images = await propertyModel
      .findById(propertyId)
      .select("images coverImageUrl coverImageCloudinaryId");

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
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const removeOwnerPropertyImg = async (req, res) => {
  const { cloudinaryId } = req.body;
  const { propertyId } = req.params;

  try {
    const foundProperty = await propertyModel.findById(propertyId);
    if (!foundProperty) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }

    // check if the length is less than or equal to 5
    if (foundProperty.images.length <= 4) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Minimum of 4 images has been reached" });
    }

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
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const addOwnerPropertyImg = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const foundProperty = await propertyModel.findById(propertyId);
    if (!foundProperty) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }

    if (foundProperty.images.length >= 8) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, msg: "Maximum of 8 images has been reached" });
    }

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

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Image added successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// change cover image
export const EditOwnerCoverImage = async (req, res) => {
  // property id
  const { propertyId } = req.params;

  try {
    const dbProperty = await propertyModel.findById(propertyId);

    if (req.userId !== dbProperty.creatorId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "You con only update your property" });
    }

    if (dbProperty.coverImageUrl && dbProperty.coverImageCloudinaryId) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(dbProperty.coverImageCloudinaryId);
    }

    // Upload new image to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path);
    const file = req.file;
    const dataUri = parser.format(file.originalname, file.buffer);
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "properties",
    });

    // Save Cloudinary URL and ID to MongoDB
    dbProperty.coverImageUrl = result.secure_url;
    dbProperty.coverImageCloudinaryId = result.public_id;
    await dbProperty.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Cover Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get property lat and long
export const ownerGetPropertyCoords = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const coords = await propertyModel.findById(propertyId).select("lat long");

    if (!coords) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "Property or Coordinate not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully",
      coords,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// update property lat and long
export const ownerUpdatePropertyCoords = async (req, res) => {
  const { lat, long } = req.body;
  const { propertyId } = req.params;

  if (!lat || !long) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ success: false, msg: "Please enter latitude and longitude." });
  }

  try {
    const property = await propertyModel.findById(propertyId);

    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "Property not found" });
    }

    if (req.userId !== property.creatorId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, msg: "You con only update your property" });
    }

    const coordsData = {
      lat,
      long,
    };

    await propertyModel.findByIdAndUpdate(propertyId, coordsData, {
      new: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const deleteOwnerProperty = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.userId;
  try {
    // Find property by ID
    const property = await propertyModel.findById(propertyId);
    // check
    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Property not found" });
    }
    // check
    if (property.creatorId.toString() !== userId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "You can only delete your own property" });
    }
    // Delete cover image from cloudinary
    if (property.coverImageUrl && property.coverImageCloudinaryId) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(property.coverImageCloudinaryId);
    }
    // Delete images from Cloudinary
    for (const image of property.images) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    }
    // Delete property from MongoDB
    await propertyModel.findByIdAndDelete(propertyId);
    // remove
    await newlyCreatedPropertyModel.findOneAndDelete({
      propertyId,
    });
    // remove
    await newlyCreatedPropertyModel.weeklyCreatedPropertyModel({
      propertyId,
    });
    // return
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property delete successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// ============is property available===========
export const toggleOwnerPropertyAvailability = async (req, res) => {
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
