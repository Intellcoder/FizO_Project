import dotenv from "dotenv";
dotenv.config();

import app from "./index";
//import connectDB from "./database/config/config";
import { connectDB, sequelize } from "./database/config/db";
const PORT = process.env.PORT || 4000;

//initialse database
connectDB();

app.listen(PORT, () =>
  console.log(`🚀Server Running on http//localhost:${PORT}`)
);
