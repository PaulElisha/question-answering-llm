/** @format */

import { RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

import { VectorConfig } from "../config/vectorConfig";

import { LoadAndParseDocs, QUESTIONS, QUESTION_PROMPT } from "../utils/loader";
import { openAIApiKey } from "../../constants/Constants";
import { Runnable } from "../utils/runnables";

class LangChainService {
  constructor(url) {
    this.loader = new LoadAndParseDocs(url);
    this.vectorConfig = new VectorConfig(openAIApiKey);
    this.runnable = new Runnable();
    this.llm = new ChatOpenAI({ openAIApiKey });
    this.outputParser = new StringOutputParser();
    this.isInitialized = false;
    this.configDataStore();
  }

  async configDataStore() {
    const textChunks = await this.loader.loadAndSplitDocs();
    await this.vectorConfig.addDocuments(textChunks);
    this.answerChain();
    this.isInitialized = true;
  }

  contextRetrievalChain() {
    const steps = [
      (input) => input.question,
      this.vectorConfig.query(),
      this.loader.parseDocs.bind(this.loader),
    ];

    return this.runnable.createChain(steps);
  }

  standAloneQuestionChain() {
    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are an expert at rephrasing questions to be standalone.`
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate(
        QUESTION_PROMPT[QUESTIONS[2]] +
          ` Rephrase the last question to be standalone: \n {question}`
      ),
    ]);

    const steps = [rephrasePrompt, this.llm, this.outputParser];

    return this.runnable.createChain(steps);
  }

  conversationChain() {
    const answerPrompt = ChatPromptTemplate.fromMessages([
      ["system", QUESTION_PROMPT[QUESTIONS[1]]],
      new MessagesPlaceholder("history"),
      [
        "human",
        "Now, answer this question using the previous context and chat history:\n{question}",
      ],
    ]);

    const steps = [
      RunnablePassthrough.assign({
        standAloneQuestion: this.standAloneQuestionChain(),
        originalQuestion: (input) => input.question,
      }),
      RunnablePassthrough.assign({
        context: (input) =>
          this.contextRetrievalChain().invoke({
            question: input.standAloneQuestion,
          }),
        question: (input) => input.originalQuestion,
      }),
      answerPrompt,
      this.llm,
      this.outputParser,
    ];

    return this.runnable.createChain(steps);
  }

  answerChain() {
    this.runnable.runnableWithMessageHistory(this.conversationChain());
  }
}

export { LangChainService };
