/** @format */

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const QUESTIONS = {
  1: "What is a system archetype?",
  2: "Can you give me some examples?",
};

export const PROMPT_TEMPLATES = {
  CONTEXT_PROMPT_TEMPLATE: `You are an experienced researcher,
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question
to the best of your ability using only the resources provided.
Be verbose!

Here is the context and question:

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`,

  REPHRASE_QUESTION_PROMPT_TEMPLATE: `Take the following conversation and rephrase the last user question to be a standalone question.`,

  ANSWER_PROMPT_TEMPLATE: `You are an experienced researcher,
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history,
answer the user's question to the best of
your ability
using only the resources provided. Be verbose!

<context>
{context}
</context>`,
};

export const QUESTION_PROMPT = {
  [QUESTIONS[1]]: PROMPT_TEMPLATES.CONTEXT_PROMPT_TEMPLATE,
  [QUESTIONS[1]]: PROMPT_TEMPLATES.ANSWER_PROMPT_TEMPLATE,
  [QUESTIONS[2]]: PROMPT_TEMPLATES.REPHRASE_QUESTION_PROMPT_TEMPLATE,
};

class LoadAndParseDocs {
  constructor(url) {
    this.loader = new CSVLoader(url);
  }

  async loadAndSplitDocs(chunkSize = 500, chunkOverlap = 50) {
    const docs = await this.loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
    const textChunks = await splitter.createDocuments(
      docs.map((doc) => doc.pageContent)
    );
    return textChunks;
  }

  parseDocs(docs) {
    return docs.map((doc) => doc.pageContent).join("\n");
  }
}

export { LoadAndParseDocs };
