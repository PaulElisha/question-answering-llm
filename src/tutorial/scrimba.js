/** @format */

// /** @format */

// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { ChatOpenAI } from "@langchain/openai";
// import { PromptTemplate } from "@langchain/core/prompts";

// import { createClient } from "@supabase/supabase-js";

// import fs from "node:fs/promises";
// import {
//   openAIApiKey,
//   supabaseUrl,
//   supabaseKey,
// } from "../../constants/Constants.js";

// try {
//   const data = await fs.readFile("info.txt", "utf-8");

//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     separators: ["\n\n", "\n", " ", ""],
//     chunkOverlap: 200,
//   });
//   const chunks = await splitter.createDocuments([data]);

//   await fs.writeFile("text.json", JSON.stringify(chunks, null, 2));

//   // const client = createClient(supabaseUrl, supabaseKey);

//   // await SupabaseVectorStore.fromDocuments(
//   //   chunks,
//   //   new OpenAIEmbeddings({ openAIApiKey }),
//   //   {
//   //     client,
//   //     tableName: "documents",
//   //   }
//   // );

//   // const llm = new ChatOpenAI({ openAIApiKey });

//   // const tweetTemplate =
//   //   "Generate a promotional tweet for a product, from this product description: {productDesc}";

//   // const prompt = PromptTemplate.fromTemplate(tweetTemplate);

//   // const chain = prompt.pipe(llm);

//   // const response = await chain.invoke({
//   //   productDesc:
//   //     "The LangChain library is a powerful tool for building applications with LLMs.",
//   // });

//   // const prompt = new PromptTemplate({
//   //   template: tweetTemplate,
//   //   inputVariables: ["productDesc"],
//   // });

//   console.log();
// } catch (error) {
//   console.error("Internal Error", error);
// }
