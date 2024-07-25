import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";

export const getRandomBuy = async (req, res) => {
  try {
    // const { category } = req.query;
    const match = { type: "buy", isAvailable: true };

    // if (category) {
    //   match.category = category;
    // }

    // Aggregation pipeline
    const properties = await propertyModel.aggregate([
      { $match: match },
      { $sample: { size: 100 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully",
      properties,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
