import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "@middlewares/errorHandler.middleware.js";

const app = express();

// App configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Routes imports
import authRoute from "@routes/auth.route.js";
import userRoute from "@routes/user.route.js";
import courtRoute from "@routes/court.route.js";
import caseTypeRoute from "@routes/caseType.route.js";
import caseRoute from "@routes/case.routes.js";
import advocateRoute from "@routes/advocate.route.js";
import hearingRoute from "@routes/hearing.route.js";
import casePartyRoute from "@routes/caseParty.route.js";
import documentRoute from "@routes/document.route.js";
import caseBookmarkRoute from "@routes/caseBookmark.route.js";
import caseViewRoute from "@routes/caseView.route.js";

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes initialization
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/courts", courtRoute);
app.use("/api/v1/case-types", caseTypeRoute);
app.use("/api/v1/cases", caseRoute);
app.use("/api/v1/advocates", advocateRoute);
app.use("/api/v1/hearings", hearingRoute);
app.use("/api/v1/case-parties", casePartyRoute);
app.use("/api/v1/documents", documentRoute);
app.use("/api/v1/case-bookmarks", caseBookmarkRoute);
app.use("/api/v1/case-views", caseViewRoute);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
});

// Error handling middleware (should be last)
app.use(errorHandler as any);

export default app;