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

import { LoadAndParseDocs } from "./loader/loader.js";
import { VectorService } from "./services/vectorService.js";
import { Runnables } from "./runnables/Runnables.js";

class App {
  constructor() {
    this.loader = new LoadAndParseDocs("./documents/system-archetypes.pdf");
    this.vectorService = new VectorService(openAIApiKey);
    this.llm = new ChatOpenAI({ openAIApiKey });
    this.runnable = new Runnables();
    this.outputParser = new StringOutputParser();
    this.app = express();
    this.router = expressRouter();
  }

  async dataStore() {
    const textChunks = await this.loader.loadAndSplitDocs();
    await this.vectorService.addDocuments(textChunks);
  }

  contextRetrievalChain() {
    const steps = [
      (input) => input.question,
      this.vectorService.getRetriever,
      this.loader.parseDocs,
    ];

    return this.runnable.createChain(steps);
  }

  answerChain() {
    const PROMPT_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question 
to the best of your ability using only the resources provided. 
Be verbose!

Here is the context and question:

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`;
    const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);

    const options = {
      context: this.contextRetrievalChain,
      question,
    };

    const steps = [options, prompt, this.llm, this.outputParser];
    return this.runnable.createChain(steps);
  }

  rephraseQuestionChain() {
    const REPHRASE_QUESTION_PROMPT_TEMPLATE = `Take the following conversation and rephrase the last user question to be a standalone question.`;

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are an expert at rephrasing questions to be standalone.`
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate(
        REPHRASE_QUESTION_PROMPT_TEMPLATE +
          ` Rephrase the last question to be standalone: \n {question}`
      ),
    ]);

    const steps = [rephrasePrompt, this.llm, this.outputParser];

    return this.runnable.createChain(steps);
  }

  conversationChain() {
    const ANSWER_PROMPT_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history, 
answer the user's question to the best of 
your ability 
using only the resources provided. Be verbose!

<context>
{context}
</context>`;

    const answerPrompt = ChatPromptTemplate.fromMessages([
      ["system", ANSWER_PROMPT_TEMPLATE],
      new MessagesPlaceholder("history"),
      [
        "human",
        "Now, answer this question using the previous context and chat history:\n{question}",
      ],
    ]);

    const steps = [
      RunnablePassthrough.assign({
        question: rephraseQuestionChain,
      }),
      RunnablePassthrough.assign({
        context: contextRetrievalChain,
      }),
      answerPrompt,
      this.llm,
      this.outputParser,
    ];

    return this.runnable.createChain(steps);
  }

  async ask(question) {
    return await this.finalRetrievalChain.invoke(question, {
      configurable: { sessionId: "test" },
    });
  }
}
const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(textChunks);

const retriever = vectorStore.asRetriever();

const convertDocsToString = (docs) => {
  return docs.map((doc) => doc.pageContent).join("\n");
};

const contextRetrievalChain = RunnableSequence.from([
  (input) => input.question,
  retriever,
  convertDocsToString,
]);

const PROMPT_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question 
to the best of your ability using only the resources provided. 
Be verbose!

Here is the context and question:

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`;

const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);

const runnableMap = RunnableMap.from({
  context: contextRetrievalChain,
  question: (input) => input.question,
});

await runnableMap.invoke({
  question: "What is a system archetype?",
});

const llm = new ChatOpenAI({ openAIApiKey, temperature: 0 });

const answerChain = RunnableSequence.from([
  {
    context: contextRetrievalChain,
    question: (input) => input.question,
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

const answer = await answerChain.invoke({
  question: "What is a system archetype?",
});

console.log("Answer:", answer);

const REPHRASE_QUESTION_PROMPT_TEMPLATE = `Take the following conversation and rephrase the last user question to be a standalone question.`;

const rephrasePrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are an expert at rephrasing questions to be standalone.`
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate(
    REPHRASE_QUESTION_PROMPT_TEMPLATE +
      ` Rephrase the last question to be standalone: \n {question}`
  ),
]);

const rephraseQuestionChain = RunnableSequence.from([
  rephrasePrompt,
  llm,
  new StringOutputParser(),
]);

const conversationHistory = [
  new HumanMessage("What is a system archetype?"),
  new AIMessage(answer),
];

const followUpQuestion = "Can you give me some examples?";

const rephraseQuestion = await rephraseQuestionChain.invoke({
  question: followUpQuestion,
  history: conversationHistory,
});

console.log("Rephrased Question:", rephraseQuestion);

const ANSWER_PROMPT_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history, 
answer the user's question to the best of 
your ability 
using only the resources provided. Be verbose!

<context>
{context}
</context>`;

const answerPrompt = ChatPromptTemplate.fromMessages([
  ["system", ANSWER_PROMPT_TEMPLATE],
  new MessagesPlaceholder("history"),
  [
    "human",
    "Now, answer this question using the previous context and chat history:\n{question}",
  ],
]);

const conversationChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    question: rephraseQuestionChain,
  }),
  RunnablePassthrough.assign({
    context: contextRetrievalChain,
  }),
  answerPrompt,
  llm,
  new StringOutputParser(),
]);

const messageHistory = new ChatMessageHistory();
const finalRetrievalChain = new RunnableWithMessageHistory.from({
  runnable: conversationChain,
  getMessageHistory: (sessionId) => messageHistory,
  historyKey: "history",
  inputKey: "question",
});

const firstAnswer = await finalRetrievalChain.invoke(
  {
    question: followUpQuestion,
  },
  {
    configurable: { sessionId: "test" },
  }
);

const finalResult = await finalRetrievalChain.invoke(
  {
    question: "Can you elaborate further?",
  },
  {
    configurable: { sessionId: "test" },
  }
);

console.log("First Answer:", firstAnswer);
console.log("Final Result:", finalResult);
