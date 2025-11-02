/** @format */

import { LangChainService } from "./langChainService";

class QuestionAnsweringService {
  constructor() {
    this.langChainService = new LangChainService(
      "./documents/system-archetypes.pdf"
    );
  }

  async askQuestion(question, userId) {
    await this.langChainService.initialize();

    const data = await this.langChainService.answerChain.invoke(question, {
      configurable: { sessionId: userId },
    });

    return {
      status: "ok",
      success: data.success,
      answer: data.answer,
    };
  }
}

export { QuestionAnsweringService };
