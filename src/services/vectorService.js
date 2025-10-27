/** @format */

class VectorService {
  constructor(openAIApiKey) {
    this.embeddings = new OpenAIEmbeddings({ openAIApiKey });
    this.dataStore = new MemoryVectorStore(this.embeddings);
  }

  async addDocuments(textChunks) {
    await this.dataStore.addDocuments(textChunks);
  }

  static getRetriever() {
    return this.dataStore.asRetriever();
  }
}

export { VectorService };
