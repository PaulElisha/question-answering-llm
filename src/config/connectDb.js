/** @format */

import mongoose from "mongoose";
import { mongoUri } from "../constants/Constants";

class connectDb {
  constructor() {
    this.connectDB();
  }

  connectDB() {
    mongoose.connect(mongoUri);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connection failed:", err.message);
    });
  }
}

export { connectDb };
