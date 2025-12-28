import "dotenv/config";
import app from "./app.js";
import connectDB from "@config/db/dbConnection.js";
import logger from "./utils/logger.util.js";

app.on("error", (err: any) => {
    console.error("App error: ", err);
    process.exit(1);
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      logger.error("Express server error:", err);
    });

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err: any) => {
    logger.error("MONGODB connection failed:", err);
    process.exit(1);
  });