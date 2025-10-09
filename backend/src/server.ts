import "dotenv/config";
import app from "./app.js";

app.on("error", (err: any) => {
    console.error("App error: ", err);
    process.exit(1);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});