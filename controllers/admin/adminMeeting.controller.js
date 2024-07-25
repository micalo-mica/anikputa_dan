import meetingModel from "../../models/meeting.model.js";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

// create meeting for admin
export const adminScheduleMeeting = async (req, res) => {
  const { firstName, lastName, email, phone, date, time, agenda } = req.body;
  const adminId = req.adminId;

  if (!firstName || !lastName || !email || !phone || !date || !time) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      msg: "Some details are missing, make sure you enter your firstName, lastName, email, phone, date and time.",
    });
  }

  try {
    const newMeeting = new meetingModel({
      adminId: adminId,
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
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// find meetings
export const adminFindMeetings = async (req, res, next) => {
  // const q = req.body;
  const { firstName, lastName, email, phoneNumber } = req.body;

  const filters = {
    ...(phoneNumber && { phoneNumber: phoneNumber }),
    ...(email && { email: email }),
    ...(firstName && {
      firstName: { $regex: firstName, $options: "i" },
    }),
    ...(lastName && {
      lastName: { $regex: lastName, $options: "i" },
    }),
  };
  try {
    const meetings = await meetingModel.find(filters);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Meetings found",
      meetings,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// all meeting
export const getAllMeetingSchedule = async (req, res) => {
  try {
    const allMeetings = await meetingModel.find({
      status: "scheduled",
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total properties gotten successfully",
      allMeetings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// single meeting
export const singleScheduledMeeting = async (req, res) => {
  const { meetingId } = req.params;
  try {
    const meeting = await meetingModel.findById(meetingId);
    if (!meeting) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Meeting not found" });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Meeting found",
      meeting,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// total meeting
export const getTotalMeetingSchedule = async (req, res) => {
  try {
    const totalMeeting = await meetingModel.countDocuments({
      status: "scheduled",
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total properties gotten successfully",
      totalMeeting,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// // get current day meeting
// export const currentDayScheduleMeeting = async (req, res) => {
//   try {
//     const today = new Date();
//     const startOfDay = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate()
//     );
//     const endOfDay = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate() + 1
//     );

//     const meetings = await meetingModel
//       .find({
//         meetingDate: {
//           $gte: startOfDay,
//           $lt: endOfDay,
//         },
//         status: "scheduled", // Filter meetings with status "scheduled"
//       })
//       .sort({ meetingDate: 1 })
//       .limit(1); // Sort by meetingDate in ascending order and limit to 1 result

//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       msg: "Total properties gotten successfully",
//       meetings,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

// get current day meeting using moment
export const currentDayScheduleMeeting = async (req, res) => {
  try {
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");

    const meetings = await meetingModel
      .find({
        meetingDate: {
          $gte: todayStart.toDate(),
          $lte: todayEnd.toDate(),
        },
        status: "scheduled", // Filter meetings with status "scheduled"
      })
      .sort({ meetingDate: 1 });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Meeting gotten successfully",
      meetings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get current day meeting count using moment
export const totalCountCurrentDayScheduleMeeting = async (req, res) => {
  try {
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");

    const meetingsCount = await meetingModel.countDocuments({
      meetingDate: {
        $gte: todayStart.toDate(),
        $lte: todayEnd.toDate(),
      },
      status: "scheduled", // Filter meetings with status "scheduled"
    });
    // .sort({ meetingDate: 1 });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total meetings gotten successfully",
      meetingsCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get tomorrow day meeting
export const tomorrowDayScheduleMeeting = async (req, res) => {
  try {
    const tomorrow = moment().add(1, "day").startOf("day");
    const startOfTomorrow = tomorrow.toDate();
    const endOfTomorrow = tomorrow.add(1, "day").toDate();

    const meetings = await meetingModel
      .find({
        meetingDate: {
          $gte: startOfTomorrow,
          $lt: endOfTomorrow,
        },
        status: "scheduled", // Filter meetings with status "scheduled"
      })
      .sort({ meetingDate: 1 })
      .limit(1); // Sort by meetingDate in ascending order and limit to 1 result

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total properties gotten successfully",
      meetings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get tomorrow day meeting count
export const totalCountTomorrowDayScheduleMeeting = async (req, res) => {
  try {
    const tomorrow = moment().add(1, "day").startOf("day");
    const startOfTomorrow = tomorrow.toDate();
    const endOfTomorrow = tomorrow.add(1, "day").toDate();

    const meetingsCount = await meetingModel.countDocuments({
      meetingDate: {
        $gte: startOfTomorrow,
        $lt: endOfTomorrow,
      },
      status: "scheduled", // Filter meetings with status "scheduled"
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total properties gotten successfully",
      meetingsCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get tomorrow day meeting
export const yesterdayDayScheduleMeeting = async (req, res) => {
  try {
    // Calculate the start and end of the previous day
    const yesterdayStart = moment().subtract(1, "days").startOf("day");
    const yesterdayEnd = moment().subtract(1, "days").endOf("day");

    // Query meetings for the previous day where status is 'scheduled'
    const meetings = await meetingModel
      .find({
        meetingDate: {
          $gte: yesterdayStart.toDate(),
          $lte: yesterdayEnd.toDate(),
        },
        // status: 'scheduled'
      })
      .sort({ meetingDate: 1 });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total properties gotten successfully",
      meetings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// get tomorrow day meeting count
export const totalCountYesterdayDayScheduleMeeting = async (req, res) => {
  try {
    // Calculate the start and end of the previous day
    const yesterdayStart = moment().subtract(1, "days").startOf("day");
    const yesterdayEnd = moment().subtract(1, "days").endOf("day");

    // Query meetings for the previous day where status is 'scheduled'
    const meetingsCount = await meetingModel
      .countDocuments({
        meetingDate: {
          $gte: yesterdayStart.toDate(),
          $lte: yesterdayEnd.toDate(),
        },
        // status: 'scheduled'
      })
      .sort({ meetingDate: 1 });

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Total properties gotten successfully",
      meetingsCount,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// assign a meeting to admin
export const assignScheduleMeetingTo = async (req, res) => {
  const { adminId } = req.body;
  const { meetingId } = req.params;
  try {
    const meeting = await meetingModel.findOneAndUpdate(
      {
        _id: meetingId,
        status: "scheduled", // Filter meetings with status "scheduled"
      },
      { adminId: adminId },
      { new: true }
    );

    if (!meeting) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Meeting not found" });
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Meeting updated successfully",
      meeting,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// toggle is meeting completed
export const toggleIsMeetingCompleted = async (req, res) => {
  const { meetingId } = req.params;
  const { completed } = req.body;
  const adminId = req.adminId;

  try {
    let meeting = await meetingModel.findById(meetingId);

    if (!meeting || meeting.status === "canceled") {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Meeting not found or concealed",
      });
    }

    // if condition
    if (completed === "Yes") {
      // update meeting
      const meeting = await meetingModel.findByIdAndUpdate(
        meetingId,
        { status: "completed", updaterId: adminId },
        { new: true }
      );

      // return something
      res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Updated successfully",
      });
      //
    } else if (completed === "No") {
      const meeting = await meetingModel.findByIdAndUpdate(
        meetingId,
        { status: "scheduled", updaterId: adminId },
        { new: true }
      );
      res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Updated successfully",
      });
    } else {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Invalid and meeting not toggled or update",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Your request could not be processed. Please try again" });
  }
};

// export const AdminEditUserAccount = async (req, res) => {
//   const {
//     accountType,
//     firstName,
//     lastName,
//     address,
//     city,
//     state,
//     phoneNumber,
//     postalCode,
//     licenseNumber,
//     //company
//     companyName,
//     industry,
//     country,
//     contactPhoneNumber,
//     contactPerson,
//     companyLicenseNumber,
//     servicesOffered,
//     // agent
//     experienceYears,
//     specialties,
//     education,
//     lga,
//     bio,
//     //
//     notes,
//   } = req.body;
//   const { userId } = req.params;

//   try {
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: true, msg: "User not found" });
//     }

//     let dataToChange = {};

//     if (accountType === "agent") {
//       dataToChange = {
//         firstName: firstName || user.firstName,
//         lastName: lastName || user.lastName,
//         address: address || user.address,
//         city: city || user.city,
//         state: state || user.state,
//         phoneNumber: phoneNumber || user.phoneNumber,
//         postalCode: postalCode || user.postalCode,
//         licenseNumber: licenseNumber || user.licenseNumber,
//         "agent.experienceYears": experienceYears || user.experienceYears,
//         "agent.specialties": specialties || user.specialties,
//         "agent.education": education || user.education,
//         "agent.lga": lga || user.lga,
//         "agent.bio": bio || user.bio,
//       };
//     } else if (accountType === "company") {
//       dataToChange = {
//         firstName: firstName || user.firstName,
//         lastName: lastName || user.lastName,
//         address: address || user.address,
//         city: city || user.city,
//         state: state || user.state,
//         phoneNumber: phoneNumber || user.phoneNumber,
//         postalCode: postalCode || user.postalCode,
//         licenseNumber: licenseNumber || user.licenseNumber,
//         "company.companyName": companyName || user.companyName,
//         "company.industry": industry || user.industry,
//         "company.country": country || user.country,
//         "company.contactPhoneNumber":
//           contactPhoneNumber || user.contactPhoneNumber,
//         "company.contactPerson": contactPerson || user.contactPerson,
//         "company.companyLicenseNumber":
//           companyLicenseNumber || user.companyLicenseNumber,
//         "company.servicesOffered": servicesOffered || user.servicesOffered,
//         //
//       };
//     } else if (accountType === "owner") {
//       dataToChange = {
//         firstName: firstName || user.firstName,
//         lastName: lastName || user.lastName,
//         address: address || user.address,
//         city: city || user.city,
//         state: state || user.state,
//         phoneNumber: phoneNumber || user.phoneNumber,
//         postalCode: postalCode || user.postalCode,
//         "owner.notes": notes || user.notes,
//       };
//     } else if (accountType === "user") {
//       dataToChange = {
//         firstName: firstName || user.firstName,
//         lastName: lastName || user.lastName,
//         address: address || user.address,
//         city: city || user.city,
//         state: state || user.state,
//         phoneNumber: phoneNumber || user.phoneNumber,
//         postalCode: postalCode || user.postalCode,
//       };
//     } else {
//       return res
//         .status(StatusCodes.NOT_ACCEPTABLE)
//         .json({ success: false, msg: "Invalid" });
//     }

//     await userModel.findByIdAndUpdate(
//       userId,
//       { $set: dataToChange },
//       { new: true }
//     );
//     res
//       .status(StatusCodes.OK)
//       .json({ success: true, msg: "Info updated successfully" });
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Your request could not be processed. Please try again" });
//   }
// };

//total meeting
