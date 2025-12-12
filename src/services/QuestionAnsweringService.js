/** @format */

import { LangChainService } from "./LangChainService.js";

class QuestionAnsweringService {
  // test/info.txt
  // /Users/paulelisha/repositories/question-answering-AI/test/info.csv
  constructor() {
    this.langChainService = new LangChainService(
      "/Users/paulelisha/repositories/question-answering-AI/test/info.csv"
    );
  }

  async askQuestion(question) {
    if (!this.langChainService.isInitialized) {
      throw new Error("The langchain service not initialized!");
    }

    const data = await this.langChainService
      .answerChain()
      .invoke(
        { question },
        { configurable: { sessionId: `thread-id-${Date.now()}` } }
      );
    return {
      status: "ok",
      success: data.success,
      answer: data.answer,
    };
  }
}

export { QuestionAnsweringService };
