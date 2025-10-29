/** @format */

import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";

import { ChatMessageHistory } from "langchain/memory";

class Runnables {
  constructor() {
    this.messageHistory = new ChatMessageHistory();
  }

  createChain(steps) {
    return RunnableSequence.from(steps);
  }

  runnableWithMessageHistory(conversationChain) {
    return new RunnableWithMessageHistory.from({
      runnable: conversationChain,
      getMessageHistory: (sessionId) => this.messageHistory,
      history: "history",
      inputKey: "question",
    });
  }
}

export { Runnables };
