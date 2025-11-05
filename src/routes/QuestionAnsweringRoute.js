/** @format */

import express from "express";
import { QuestionAnsweringController } from "../controllers/QuestionAnsweringController.js";

class QuestionAnsweringRoute {
  constructor() {
    this.router = express.Router();
    this.questionAnsweringController = new QuestionAnsweringController();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(
      "/ask-question/",
      this.questionAnsweringController.askQuestion
    );
  }
}

const QuestionAnsweringRouter = new QuestionAnsweringRoute().router;
export { QuestionAnsweringRouter };
