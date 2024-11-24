
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
  path: "../.env",
});

connectDB()
  .then(() => {
    app
      .listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at ${process.env.PORT}`);
      })
      .on("error", (error) => {
        console.error(`Error while starting the server: ${error.message}`);
        process.exit(1); // Exit the process if there's an error starting the server
      });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed ${error}`);
  });








  
// const connectdb=()=>{
// }
/*import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("App Error:", error);
      throw error;
    });
    app.listen(`${process.env.PORT}`, () => {
      console.log(`App is on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR:", error);
    throw error;
  }
})(); */
