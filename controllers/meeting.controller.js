import { StatusCodes } from "http-status-codes";
import meetingModel from "../models/meeting.model.js";

export const scheduleMeeting = async (req, res) => {
  const { firstName, lastName, email, phone, date, time, agenda } = req.body;
  if (!firstName || !lastName || !email || !phone || !date || !time) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      msg: "Some details are missing, make sure you enter your firstName, lastName, email, phone, date and time.",
    });
  }
  try {
    const newMeeting = new meetingModel({
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      agenda,
    });
    await newMeeting.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};
