import express from "express";
import {
  totalCountCurrentDayScheduleMeeting,
  adminScheduleMeeting,
  assignScheduleMeetingTo,
  currentDayScheduleMeeting,
  getAllMeetingSchedule,
  getTotalMeetingSchedule,
  singleScheduledMeeting,
  tomorrowDayScheduleMeeting,
  yesterdayDayScheduleMeeting,
  totalCountTomorrowDayScheduleMeeting,
  totalCountYesterdayDayScheduleMeeting,
  toggleIsMeetingCompleted,
  adminFindMeetings,
} from "../../controllers/admin/adminMeeting.controller.js";
import {
  checkAdminRole,
  verifyAdminToken,
} from "../../middlewares/verifyAdminToken.js";
import { ROLES } from "../../utils/roles.js";
const router = express.Router();

router.use(verifyAdminToken);

//create meeting
router.post("/", checkAdminRole([...ROLES.All]), adminScheduleMeeting);

//create meeting
router.post(
  "/adminFindMeetings",
  checkAdminRole([...ROLES.All]),
  adminFindMeetings
);

//all meeting
router.get("/", checkAdminRole([...ROLES.All]), getAllMeetingSchedule);

//single meeting
router.get(
  "/:meetingId",
  checkAdminRole([...ROLES.All]),
  singleScheduledMeeting
);

//total meeting count
router.get(
  "/total/getTotalMeetingSchedule",
  checkAdminRole([...ROLES.All]),
  getTotalMeetingSchedule
);

//current day meeting
router.get(
  "/meeting/currentDayScheduleMeeting",
  checkAdminRole([...ROLES.All]),
  currentDayScheduleMeeting
);

//current day meeting count
router.get(
  "/meeting/totalCountCurrentDayScheduleMeeting",
  checkAdminRole([...ROLES.All]),
  totalCountCurrentDayScheduleMeeting
);

//tomorrow day meeting
router.get(
  "/meeting/tomorrowDayScheduleMeeting",
  checkAdminRole([...ROLES.All]),
  tomorrowDayScheduleMeeting
);

//tomorrow day meeting count
router.get(
  "/meeting/totalCountTomorrowDayScheduleMeeting",
  checkAdminRole([...ROLES.All]),
  totalCountTomorrowDayScheduleMeeting
);

// yesterday meeting
router.get(
  "/meeting/yesterdayDayScheduleMeeting",
  checkAdminRole([...ROLES.All]),
  yesterdayDayScheduleMeeting
);

//yesterday meeting count
router.get(
  "/meeting/totalCountYesterdayDayScheduleMeeting",
  checkAdminRole([...ROLES.All]),
  totalCountYesterdayDayScheduleMeeting
);

// assign a meeting to admin
router.put(
  "/:meetingId",
  checkAdminRole([...ROLES.All]),
  assignScheduleMeetingTo
);

// toggle Is Meeting Completed
router.put(
  "/isCompleted/:meetingId",
  checkAdminRole([...ROLES.All]),
  toggleIsMeetingCompleted
);

export default router;
