import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const MONGO_URI =
  (process.env.MONGODB_URI as string) ||
  "mongodb://localhost:27017/pollyreport";
const PRODUCTION_MONGO_URI = process.env.PRODUCTION_MONGO_URI as string;

const connectDB = async (): Promise<void> => {
  if (process.env.NODE_ENV === "PRODUCTION") {
    await mongoose
      .connect(PRODUCTION_MONGO_URI)
      .then(() => console.log(`Mongoose Running on production mode`))
      .catch((err) => {
        console.log(err.message);
        process.exit(1);
      });
  } else {
    await mongoose
      .connect(MONGO_URI)
      .then(() => console.log(`Mongodb running on local server`))
      .catch((err) => {
        console.log(err.message);
        process.exit(1);
      });
  }
};

export default connectDB;
