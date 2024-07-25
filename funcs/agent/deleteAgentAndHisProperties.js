// import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary library

// // Function to delete agent and associated properties along with their images from Cloudinary

// export const deleteAgentAndProperties = async (agentId) => {
//   try {
//     // Find agent by ID and retrieve imageUrl and cloudinaryId
//     const agent = await Agent.findById(agentId);
//     const { imageUrl, cloudinaryId } = agent;

//     // Delete agent's image from Cloudinary
//     await cloudinary.uploader.destroy(cloudinaryId);

//     // Delete agent from database
//     await Agent.findByIdAndDelete(agentId);

//     // Find properties associated with the agent
//     const properties = await Property.find({ agentId: agentId });

//     // Iterate through each property
//     for (const property of properties) {
//       // Iterate through each image of the property
//       for (const image of property.images) {
//         // Delete property image from Cloudinary
//         await cloudinary.uploader.destroy(image.cloudinaryId);
//       }
//       // Delete property from database
//       await Property.findByIdAndDelete(property._id);
//     }

//     console.log("Agent and associated properties deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting agent and properties:", error);
//   }
// };
