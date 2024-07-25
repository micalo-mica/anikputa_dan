import { StatusCodes } from "http-status-codes";
import propertyModel from "../models/property.model.js";
import agentModel from "../models/agent.model.js";

export const getPropertyDetail = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    let property = await propertyModel.findById(propertyId);
    // if (!property) {
    //   return res.status(StatusCodes.NOT_FOUND).send("Item not found!");
    // }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property gotten successfully",
      property,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const getPropertyDetailWithVisualId = async (req, res) => {
  try {
    const visualId = req.params.visualId;

    let property = await propertyModel.findOne({ visualId });
    if (!property) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `Property might not be available`,
        property: "",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Property gotten successfully",
      property,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

export const propertyCardAgentInfo = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    let property = await propertyModel.findById(propertyId);
    if (!property) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Property not found",
      });
    }

    if (property.isRentOwnerWantOrantageService) {
      const agent = await agentModel.findOne({ serviceType: "orantage" });
      // let agent = await agentModel.findById(agentId);
      if (!agent) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          msg: "Agent not found",
        });
      } else {
        return res.status(StatusCodes.OK).json({
          success: true,
          msg: "Agent gotten successfully",
          agent,
        });
      }
    } else {
      // for others
      const agentId = property.agentId;

      let agent = await agentModel.findById(agentId);
      if (!agent) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          msg: "Agent not found",
        });
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Agent gotten successfully",
        agent,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
