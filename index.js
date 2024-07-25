import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import schedule from "node-schedule";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./utils/db.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import authRoute from "./routes/auth.route.js";
import googleAuthRoute from "./routes/googleAuth.route.js";
import propertyRoute from "./routes/property.route.js";
import rentRoute from "./routes/rent.route.js";
import buyRoute from "./routes/buy.route.js";
import commercialRoute from "./routes/commercial.route.js";
import plotRoute from "./routes/plot.route.js";
import propertyDetailRoute from "./routes/propertyDetail.route.js";
import propertyQueryRoute from "./routes/propertyQuery.route.js";
import clientRoute from "./routes/client.route.js";
import agentDashBoardRoute from "./routes/agentDashBoard.route.js";
import savedSearchRoute from "./routes/savedSearch.route.js";
import ownerPropertyRoute from "./routes/ownerProperty.route.js";
import adminAuthRoute from "./routes/admin/adminAuth.route.js";
import adminDashboardRoute from "./routes/admin/adminDashboard.route.js";
import adminClientRoute from "./routes/admin/adminClient.route.js";
import adminGetUsersRoute from "./routes/admin/adminGetUsers.route.js";
import adminGetPropertyRoute from "./routes/admin/adminGetProperty.route.js";
import adminGetAdminRoute from "./routes/admin/adminGetAdmin.route.js";
import adminPropertySoldRoute from "./routes/admin/adminPropertySold.route.js";
import agentPropertySoldRoute from "./routes/agentPropertySold.route.js";
import meetingRoute from "./routes/meeting.route.js";
import adminMeetingsRoute from "./routes/admin/adminMeetings.route.js";
import agentRoute from "./routes/agent.route.js";
import reasonRoute from "./routes/reason.route.js";
import agentProfileRoute from "./routes/agentProfile.route.js";
import ownerListPropertyRoute from "./routes/ownerListProperty.route.js";
import mapQueryRoute from "./routes/mapQuery.route.js";
import userProfileRoute from "./routes/userProfile.route.js";
import userSubscriptionRoute from "./routes/userSubscription.route.js";
import paymentRoute from "./routes/payment.route.js";
import userPremiumFeaturesRoute from "./routes/userPremiumFeatures.route.js";
import propertySubscriptionUpdateRoute from "./routes/propertySubscriptionUpdate.route.js";
// admin
import adminGetAgentsRoute from "./routes/admin/adminGetAgents.route.js";
import adminProfileRoute from "./routes/admin/adminProfile.route.js";
import adminSubTypesUpdateRoute from "./routes/admin/adminSubTypesUpdate.route.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

// const allowedOrigins = [process.env.DOMAIN, process.env.DOMAIN1];

// app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cors({ origin: true, credentials: true }));

// app.use(express.json({ limit: "5mb" }));
app.use(express.json());
app.use(cookieParser());

app.use(helmet());
// To remove data using these defaults:
app.use(mongoSanitize());

// routes
app.use("/api/auth", authRoute);
app.use("/api/property", propertyRoute);
app.use("/api/rent", rentRoute);
app.use("/api/buy", buyRoute);
app.use("/api/commercial", commercialRoute);
app.use("/api/plot", plotRoute);
app.use("/api/propertyDetail", propertyDetailRoute);
app.use("/api/propertyQuery", propertyQueryRoute);
app.use("/api/client", clientRoute);
app.use("/api/agentDashBoard", agentDashBoardRoute);
app.use("/api/savedSearch", savedSearchRoute);
app.use("/api/ownerProperty", ownerPropertyRoute);
app.use("/api/agentPropertySold", agentPropertySoldRoute);
app.use("/api/meeting", meetingRoute);
app.use("/api/googleAuth", googleAuthRoute);
app.use("/api/agent", agentRoute);
app.use("/api/agentProfile", agentProfileRoute);
app.use("/api/ownerListProperty", ownerListPropertyRoute);
app.use("/api/reason", reasonRoute);
app.use("/api/mapQuery", mapQueryRoute);
app.use("/api/userProfile", userProfileRoute);
app.use("/api/userSubscription", userSubscriptionRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/userPremiumFeatures", userPremiumFeaturesRoute);
app.use("/api/propertySubscriptionUpdate", propertySubscriptionUpdateRoute);

// admin
app.use("/api/adminAuth", adminAuthRoute);
app.use("/api/adminDashboard", adminDashboardRoute);
app.use("/api/adminClient", adminClientRoute);
app.use("/api/adminGetUsers", adminGetUsersRoute);
app.use("/api/adminGetProperty", adminGetPropertyRoute);
app.use("/api/adminGetAdmin", adminGetAdminRoute);
app.use("/api/adminPropertySold", adminPropertySoldRoute);
app.use("/api/adminMeetings", adminMeetingsRoute);
app.use("/api/adminGetAgent", adminGetAgentsRoute);
app.use("/api/adminProfile", adminProfileRoute);
app.use("/api/adminSubTypesUpdate", adminSubTypesUpdateRoute);

const port = process.env.PORT || 8800;
const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Backend server is running ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
