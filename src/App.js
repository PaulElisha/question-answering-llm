/** @format */

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

import fs from "node:fs/promises";
import {
  openAIApiKey,
  supabaseUrl,
  supabaseKey,
} from "../constants/Constants.js";

try {
  const data = await fs.readFile("info.txt", "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments([data]);

  await fs.writeFile("chunks.json", JSON.stringify(chunks, null, 2));

  const client = createClient(supabaseUrl, supabaseKey);

  await SupabaseVectorStore.fromDocuments(
    chunks,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: "documents",
    }
  );

  console.log(chunks);
} catch (error) {
  console.error("Internal Error", error);
}
