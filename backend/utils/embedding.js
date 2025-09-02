const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { v4: uuidv4 } = require('uuid');

async function processAndStoreText(text, pineconeClient, indexName) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);
  const { XenovaEmbeddings } = require('./xenovaEmbeddings');
  const embeddings = new XenovaEmbeddings({
    model: 'Xenova/all-roberta-large-v1',
  });

  const pineconeIndex = pineconeClient.index(indexName);

  const ids = docs.map(() => uuidv4());

  const vectors = await embeddings.embedDocuments(docs.map(d => d.pageContent));

  const records = docs.map((doc, i) => ({
    id: ids[i],
    values: vectors[i],
    metadata: { text: doc.pageContent }
  }));

  await pineconeIndex.upsert(records);

  return ids;
}

module.exports = { processAndStoreText };