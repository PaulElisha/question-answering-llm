/** @format */

import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";

import { ChatMessageHistory } from "langchain/memory";

class Runnables {
  constructor() {}

  createChain(steps) {
    return RunnableSequence.from(steps);
  }

  runnableWithMessageHistory(chain) {
    const messageHistory = new ChatMessageHistory();

    return new RunnableWithMessageHistory.from({
      runnable: chain,
      getMessageHistory: (sessionId) => messageHistory,
      history: "history",
      inputKey: "question",
    });
  }
}

export { Runnables };
