/** @format */

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

class LoadAndParseDocs {
  constructor(url) {
    this.loader = new PDFLoader(url);
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
