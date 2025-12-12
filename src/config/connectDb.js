/** @format */

import mongoose from "mongoose";
import { mongoUri } from "../constants/constants.js";

class Db {
  connect() {
    mongoose.connect(mongoUri);

    mongoose.connection.on("connected", () => {
      this.connected = true;
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      this.connected = false;
      console.error("Error connection failed:", err.message);
    });
  }
}

export { Db };
