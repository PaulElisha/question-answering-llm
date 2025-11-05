/** @format */

import { QuestionAnsweringService } from "./QuestionAnsweringService.js";

class QuestionAnsweringController {
  constructor() {
    this.questionAnsweringService = new QuestionAnsweringService();
  }

  async askQuestion(req, res) {
    const userId = req.user._id;
    const question = req.body.question;

    try {
      const response = await this.questionAnsweringService.askQuestion(
        question,
        userId
      );
      res.status(200).json({
        status: response.status,
        success: response.success,
        answer: response.answer,
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export { QuestionAnsweringController };
