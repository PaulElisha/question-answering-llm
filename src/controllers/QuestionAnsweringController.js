/** @format */

import { QuestionAnsweringService } from "../services/QuestionAnsweringService.js";

class QuestionAnsweringController {
  constructor() {
    this.questionAnsweringService = new QuestionAnsweringService();
  }

  async askQuestion(req, res) {
    const userId = req.user._id;
    const question = req.body.question;

    try {
      const response = this.questionAnsweringService.askQuestion(
        question,
        userId
      );
      res.status(200).json({
        status: response.status,
        success: response.success,
        answer: (await response).answer,
      });
    } catch (error) {}
  }
}

export { QuestionAnsweringController };
