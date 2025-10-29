/** @format */
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
class VectorService {
  constructor(openAIApiKey) {
    this.embeddings = new OpenAIEmbeddings({ openAIApiKey });
    this.dataStore = new MemoryVectorStore(this.embeddings);
  }

  async addDocuments(textChunks) {
    await this.dataStore.addDocuments(textChunks);
  }

  getRetriever() {
    return this.dataStore.asRetriever();
  }
}

export { VectorService };
