import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

const { Cloudinary_cloud_name, Cloudinary_api_key, Cloudinary_api_secret } =
  process.env;

cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
});

/////////////////////////
// Uploads an image file
/////////////////////////
export const uploadImage = async (imagePath, folderName) => {
  // const options = {
  //   use_filename: true,
  //   unique_filename: false,
  //   overwrite: true,
  //   folder: folderName,
  // };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folderName,
    });
    // const result = await cloudinary.uploader.upload(imagePath, options);
    return { url: result.url, public_id: result.public_id };
  } catch (error) {
    console.error(error);
  }
};

export const removeFromCloudinary = async (public_id) => {
  return await cloudinary.uploader.destroy(public_id);
  // await cloudinary.uploader.destroy(public_id, function (error, result) {
  //   console.log(result, error);
  // });
};
