/** @format */

import express from "express";

import { LangChainService } from "./services/langChainService.js";
import { VectorService } from "./services/vectorService.js";
import { port, hostname } from "../constants/Constants.js";

import { connectDb } from "../config/connectDb.js";

class App {
  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    this.answerChain();

    this.app.post("/ask-question", async (req, res) => {
      const { question } = req.body;
      try {
        const result = await this.askQuestion(question);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });
  }

  startServer() {
    new connectDb();
    this.app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}`);
    });
  }
}

const app = new App();
app.startServer();
