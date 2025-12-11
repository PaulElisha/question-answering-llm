/** @format */

import { LangChainService } from "../LangChainService";
import { UserModel } from "../models/UserModel.js";

class QuestionAnsweringService {
  constructor() {
    this.langChainService = new LangChainService(
      "./documents/system-archetypes.pdf"
    );
  }

  async askQuestion(question, userId) {
    if (!this.langChainService.isInitialized) {
      throw new Error("The langchain service not initialized!");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    if (user._id.toString() !== userId) {
      throw new Error("Unauthorized access!");
    }

    const data = await this.langChainService
      .answerChain()
      .invoke({ question }, { configurable: { sessionId: `thread-id-${Date.now()}` } });
    return {
      status: "ok",
      success: data.success,
      answer: data.answer,
    };
  }
}

export { QuestionAnsweringService };
