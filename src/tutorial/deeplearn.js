/** @format */

// /** @format */

// import { ChatOpenAI } from "@langchain/openai";
// import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import { openAIApiKey } from "../../constants/Constants.js";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import {
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import {
//   RunnableMap,
//   RunnablePassthrough,
//   RunnableSequence,
//   RunnableWithMessageHistory,
// } from "@langchain/core/runnables";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { CharacterTextSplitter } from "langchain/text_splitter";
// import { MessagesPlaceholder } from "@langchain/core/prompts";

// import * as parse from "pdf-parse";
// const { PDFParse } = pkg;
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// import { OpenAIEmbeddings } from "@langchain/openai";
// import { similarity } from "ml-distance";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { VectorStore } from "@langchain/core/vectorstores";
// import { ChatMessageHistory } from "langchain/memory";

// /// 0 -- -- Simple LLM call

// // const llm = new ChatOpenAI({ openAIApiKey });

// // await llm.invoke([new HumanMessage("Tell me a joke about programming.")]);

// /// 1 -- -- Simple prompt

// // const prompt = ChatPromptTemplate.fromTemplate(
// //   `What are good name for a company that makes {product}?`
// // );

// // await prompt.formatMessages({ product: "colorful socks" });

// /// 2 -- Create prompt with system and human messages

// // const prompt = new ChatPromptTemplate([
// //     SystemMessagePromptTemplate.fromTemplate(
// //       `You are a helpful assistant that creates company names.`
// //     ),
// //     HumanMessagePromptTemplate.fromTemplate( `What are good name for a company that makes {product}?`),
// // ])

// // await prompt.formatMessages({ product: "colorful socks" });

// // const chain = prompt.pipe(llm);
// // const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// // const response = await chain.invoke({ product: "colorful socks" });

// /// 3 -- Chain with RunnableSequence

// // const prompt = new ChatPromptTemplate([
// //   SystemMessagePromptTemplate.fromTemplate(
// //     `You are a helpful assistant that creates company names.`
// //   ),
// //   HumanMessagePromptTemplate.fromTemplate(
// //     `What are good name for a company that makes {product}?`
// //   ),
// // ]);

// // const chain = RunnableSequence.from([
// //   prompt,
// //   llm,
// //   new StringOutputParser(),
// // ]);

// // await chain.invoke({ product: "colorful socks" });

// /// 4 -- Document loading and parsing

// // const loader = new PDFLoader(
// //   "./Users/paulelisha/Downloads/ThinkinginSystems.pdf"
// // );
// // const docs = await loader.load();
// // console.logs("Loaded documents:", docs);

// // const parser = new PDFParse(
// //   "https://research.fit.edu/media/site-specific/researchfitedu/coast-climate-adaptation-library/climate-communications/psychology-amp-behavior/Meadows-2008.-Thinking-in-Systems.pdf"
// // );
// // const result = await parser.getText().text;
// // console.log("PDF text content:", result);

// // const data = await parse(await docs[0].pageContent);

// // console.log(data.text.slice(0, 500));

// /// 5 --- Recursive code splitter

// // const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
// //   chunkSize: 1000,
// //   chunkOverlap: 200,
// // });

// // const code = `function add(a, b) {
// //   return a + b;
// // }

// // console.log(add(2, 3)); // Output: 5
// // `;

// // const chunks = await splitter.createDocuments([code]);

// // console.log("Code Chunks:", chunks);

// /// 6 --- Character text splitter

// // const charSplitter = new CharacterTextSplitter({
// //   chunkSize: 500,
// //   chunkOverlap: 50,
// // });

// // const text = `In computer science, a data structure is a data organization, storage, and retrieval format that enables efficient access and modification. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs. Each data structure has its own strengths and weaknesses, making them suitable for different types of applications and algorithms. Choosing the right data structure is crucial for optimizing performance and resource utilization in software development.`;

// // const textChunks = await charSplitter.createDocuments([text]);

// /// 7 --- Embeddings and similarity

// // const embeddings = new OpenAIEmbeddings({ openAIApiKey });

// // await embeddings.embedQuery(
// //   "The LangChain library is a powerful tool for building applications with LLMs."
// // );

// // const vector1 = await embeddings.embedQuery("Hello, world!");
// // const vector2 = await embeddings.embedQuery("Hello, world!!");

// // const sim = similarity.cosine(vector1, vector2);

// // console.log("Cosine Similarity:", sim);

// /// 8 --- Local in-memory vector store

// // const loader = new PDFLoader(
// //   "./Users/paulelisha/Downloads/ThinkinginSystems.pdf"
// // );
// // const docs = await loader.load();

// // const charSplitter = new RecursiveCharacterTextSplitter({
// //   chunkSize: 500,
// //   chunkOverlap: 50,
// // });

// // const textChunks = await charSplitter.createDocuments(
// //   docs.map((doc) => doc.pageContent)
// // );

// // console.log("Text Chunks:", textChunks);

// // const embeddings = new OpenAIEmbeddings({ openAIApiKey });

// // const vectorStore = new MemoryVectorStore(embeddings);
// // await vectorStore.addDocuments(textChunks)

// // const retrievedDocs = await vectorStore.similaritySearch(
// //   "What is a system archetype?",  2
// // )

// // const contents = retrievedDocs.map((doc) => doc.pageContent).join("\n");

// /// 9 ---

// // const retriever = vectorStore.asRetriever(2);
// // await retriever.invoke("What is a system archetype?");

// /// 10 --- Question and answer llm

// // const loader = new PDFLoader(
// //   "./Users/paulelisha/Downloads/ThinkinginSystems.pdf"
// // );
// // const docs = await loader.load();

// // const charSplitter = new RecursiveCharacterTextSplitter({
// //   chunkSize: 500,
// //   chunkOverlap: 50,
// // });

// // const textChunks = await charSplitter.createDocuments(
// //   docs.map((doc) => doc.pageContent)
// // );

// // const embeddings = new OpenAIEmbeddings({ openAIApiKey });
// // const vectorStore = new MemoryVectorStore(embeddings);
// // await vectorStore.addDocuments(textChunks);

// // const retriever = vectorStore.asRetriever(3);

// // const question = "What is a system archetype?";

// // const relevantDocs = await retriever.invoke(question);

// /// 11 --- Question and answer with context chain

// // const loader = new PDFLoader(
// //   "./Users/paulelisha/Downloads/ThinkinginSystems.pdf"
// // );
// // const docs = await loader.load();

// // const splitter = new RecursiveCharacterTextSplitter({
// //   chunkSize: 500,
// //   chunkOverlap: 50,
// // });

// // const textChunks = await splitter.createDocuments(
// //   docs.map((doc) => doc.pageContent)
// // );

// // const embeddings = new OpenAIEmbeddings({ openAIApiKey });
// // const vectorStore = new MemoryVectorStore(embeddings);
// // await vectorStore.addDocuments(textChunks);

// // const retriever = vectorStore.asRetriever();

// // const convertDocsToString = (docs) => {
// //   return docs.map((doc) => doc.pageContent).join("\n");
// // };

// // const contextChain = RunnableSequence.from([
// //   (input) => input.question,
// //   retriever,
// //   convertDocsToString,
// // ]);

// // const TEMPLATE_PROMPT = `You are an experienced researcher,
// // expert at interpreting and answering questions based on provided sources.
// // Using the provided context, answer the user's question
// // to the best of your ability using only the resources provided.
// // Be verbose!

// // Here is the context and question:

// // <context>

// // {context}

// // </context>

// // Now, answer this question using the above context:

// // {question}`;

// // const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE_PROMPT);

// // const runnableMap = RunnableMap.from({
// //   context: contextChain,
// //   question: (input) => input.question,
// // });

// // await runnableMap.invoke({
// //   question: "What is a system archetype?",
// // });

// // const llm = new ChatOpenAI({ openAIApiKey, temperature: 0 });

// // const answerChain = RunnableSequence.from([
// //   {
// //     context: contextChain,
// //     question: (input) => input.question,
// //   },
// //   prompt,
// //   llm,
// //   new StringOutputParser(),
// // ]);

// // const answer = await answerChain.invoke({
// //   question: "What is a system archetype?",
// // });

// // console.log("Answer:", answer);

// /// 12 --- Chain with conversation history and MessagesPlaceholder

// const loader = new PDFLoader(
//   "./Users/paulelisha/Downloads/ThinkinginSystems.pdf"
// );
// const docs = await loader.load();

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 50,
// });

// const textChunks = await splitter.createDocuments(
//   docs.map((doc) => doc.pageContent)
// );

// const embeddings = new OpenAIEmbeddings({ openAIApiKey });
// const vectorStore = new MemoryVectorStore(embeddings);
// await vectorStore.addDocuments(textChunks);

// const retriever = vectorStore.asRetriever();

// const convertDocsToString = (docs) => {
//   return docs.map((doc) => doc.pageContent).join("\n");
// };

// const contextChain = RunnableSequence.from([
//   (input) => input.question,
//   retriever,
//   convertDocsToString,
// ]);

// const PROMPT_TEMPLATE = `You are an experienced researcher,
// expert at interpreting and answering questions based on provided sources.
// Using the provided context, answer the user's question
// to the best of your ability using only the resources provided.
// Be verbose!

// Here is the context and question:

// <context>

// {context}

// </context>

// Now, answer this question using the above context:

// {question}`;

// const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);

// const runnableMap = RunnableMap.from({
//   context: contextChain,
//   question: (input) => input.question,
// });

// await runnableMap.invoke({
//   question: "What is a system archetype?",
// });

// const llm = new ChatOpenAI({ openAIApiKey, temperature: 0 });

// const answerChain = RunnableSequence.from([
//   {
//     context: contextChain,
//     question: (input) => input.question,
//   },
//   prompt,
//   llm,
//   new StringOutputParser(),
// ]);

// const answer = await answerChain.invoke({
//   question: "What is a system archetype?",
// });

// console.log("Answer:", answer);

// const REPHRASE_QUESTION_PROMPT_TEMPLATE = `Take the following conversation and rephrase the last user question to be a standalone question.`;

// const rephrasePrompt = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate(
//     `You are an expert at rephrasing questions to be standalone.`
//   ),
//   new MessagesPlaceholder("history"),
//   HumanMessagePromptTemplate.fromTemplate(
//     REPHRASE_QUESTION_PROMPT_TEMPLATE +
//       ` Rephrase the last question to be standalone: \n {question}`
//   ),
// ]);

// const rephraseQuestionChain = RunnableSequence.from([
//   rephrasePrompt,
//   llm,
//   new StringOutputParser(),
// ]);

// const conversationHistory = [
//   new HumanMessage("What is a system archetype?"),
//   new AIMessage(answer),
// ];

// const followUpQuestion = "Can you give me some examples?";

// const rephraseQuestion = await rephraseQuestionChain.invoke({
//   question: followUpQuestion,
//   history: conversationHistory,
// });

// console.log("Rephrased Question:", rephraseQuestion);

// const ANSWER_PROMPT_TEMPLATE = `You are an experienced researcher,
// expert at interpreting and answering questions based on provided sources.
// Using the below provided context and chat history,
// answer the user's question to the best of
// your ability
// using only the resources provided. Be verbose!

// <context>
// {context}
// </context>`;

// const answerPrompt = ChatPromptTemplate.fromMessages([
//   ["system", ANSWER_PROMPT_TEMPLATE],
//   new MessagesPlaceholder("history"),
//   [
//     "human",
//     "Now, answer this question using the previous context and chat history:\n{question}",
//   ],
// ]);

// const conversationChain = RunnableSequence.from([
//   RunnablePassthrough.assign({
//     question: rephraseQuestionChain,
//   }),
//   RunnablePassthrough.assign({
//     context: contextChain,
//   }),
//   answerPrompt,
//   llm,
//   new StringOutputParser(),
// ]);

// const messageHistory = new ChatMessageHistory();
// const finalRetrievalChain = new RunnableWithMessageHistory.from({
//   runnable: conversationChain,
//   getMessageHistory: (sessionId) => messageHistory,
//   historyKey: "history",
//   inputKey: "question",
// });

// const firstAnswer = await finalRetrievalChain.invoke(
//   {
//     question: "What is a system archetype?",
//   },
//   {
//     configurable: { sessionId: "test" },
//   }
// );

// const finalResult = await finalRetrievalChain.invoke(
//   {
//     question: "Can you elaborate further?",
//   },
//   {
//     configurable: { sessionId: "test" },
//   }
// );

// console.log("First Answer:", firstAnswer);
// console.log("Final Result:", finalResult);
