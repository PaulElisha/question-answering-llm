/** @format */

import express from "express";
import cors from "cors";

import { port, hostname } from "../constants/Constants.js";
import { connectDb } from "../config/connectDb.js";

import { QuestionAnsweringRouter } from "./routes/QuestionAnsweringRoute.js";

class App {
  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.db = new connectDb();
  }

  initializeMiddleware() {
    this.app.use(cors("*"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    this.app.use("/api/question-answering", QuestionAnsweringRouter);
  }

  startServer() {
    if (!this.db.connected) {
      console.log("Database not connected yet. Please wait...");
      return;
    }
    this.app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}`);
    });
  }
}

const app = new App();
app.startServer();
