import "dotenv/config";
import app from "./app.js";
import connectDB from "@config/db/dbConnection.js";

app.on("error", (err: any) => {
    console.error("App error: ", err);
    process.exit(1);
});

const PORT = process.env.PORT || 8000;

connectDB()
.then( () => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
})
.catch( (err: any) => {
    console.log("MONGODB connection failed: ", err);
    process.exit(1);
})