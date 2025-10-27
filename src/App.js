/** @format */

import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { openAIApiKey } from "../constants/Constants.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { MessagesPlaceholder } from "@langchain/core/prompts";

import * as parse from "pdf-parse";
const { PDFParse } = pkg;
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { OpenAIEmbeddings } from "@langchain/openai";
import { similarity } from "ml-distance";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VectorStore } from "@langchain/core/vectorstores";
import { ChatMessageHistory } from "langchain/memory";

import {
  LoadAndParseDocs,
  QUESTION_PROMPT,
  QUESTIONS,
} from "./loader/loader.js";
import { VectorService } from "./services/vectorService.js";
import { Runnables } from "./runnables/runnables.js";

import express from "express";

class App {
  constructor() {
    this.loader = new LoadAndParseDocs("./documents/system-archetypes.pdf");
    this.vectorService = new VectorService(openAIApiKey);
    this.llm = new ChatOpenAI({ openAIApiKey });
    this.runnable = new Runnables();
    this.outputParser = new StringOutputParser();
    this.app = express();
    this.initialize();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  async initialize() {
    await this.dataStore();
    this.finalResponseChain();
  }

  initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
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

  async dataStore() {
    const textChunks = await this.loader.loadAndSplitDocs();
    await this.vectorService.addDocuments(textChunks);
  }

  contextRetrievalChain() {
    const steps = [
      (input) => input.question,
      this.vectorService.getRetriever,
      this.loader.parseDocs.bind(this.loader),
    ];

    return this.runnable.createChain(steps);
  }

  answerChain() {
    const prompt = ChatPromptTemplate.fromTemplate(
      QUESTION_PROMPT[QUESTIONS[1]]
    );

    const options = {
      context: this.contextRetrievalChain,
      question,
    };

    const steps = [options, prompt, this.llm, this.outputParser];
    return this.runnable.createChain(steps);
  }

  rephraseQuestionChain() {
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
        question: this.rephraseQuestionChain(),
      }),
      RunnablePassthrough.assign({
        context: this.contextRetrievalChain(),
      }),
      answerPrompt,
      this.llm,
      this.outputParser,
    ];

    return this.runnable.createChain(steps);
  }

  finalResponseChain() {
    this.runnable.runnableWithMessageHistory(this.conversationChain());
  }

  async askQuestion(question) {
    const answer = await this.finalResponseChain.invoke(question, {
      configurable: { sessionId: "test" },
    });

    return {
      status: "ok",
      data: answer,
    };
  }

  startServer() {
    this.app.listen(PORT, () => {
      console.log(`Server running at http://${HOST_NAME}:${PORT}`);
    });
  }
}

const app = new App();
app.startServer();
