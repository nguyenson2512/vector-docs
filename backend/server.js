require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const { extractText } = require('./utils/textExtraction');
const { processAndStoreText } = require('./utils/embedding');
const Document = require('./models/Document');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Register plugins
fastify.register(require('@fastify/multipart'));
fastify.register(require('@fastify/cors'));

// Routes
fastify.post('/upload', async (request, reply) => {
  const data = await request.file();
  if (!data) {
    return reply.code(400).send({ error: 'No file uploaded' });
  }

  const fileType = path.extname(data.filename).toLowerCase().replace('.', '');
  if (!['pdf', 'txt'].includes(fileType)) {
    return reply.code(400).send({ error: 'Only PDF and TXT files are allowed' });
  }

  const tempPath = path.join(__dirname, 'temp', data.filename);
  await fs.promises.mkdir(path.dirname(tempPath), { recursive: true });
  const buffer = await data.toBuffer();
  await fs.promises.writeFile(tempPath, buffer);

  try {
    const extractedText = await extractText(tempPath, fileType);
    const pineconeIds = await processAndStoreText(extractedText, pinecone, process.env.PINECONE_INDEX_NAME);

    const document = new Document({
      name: data.filename,
      type: fileType,
      size: buffer.length,
      extractedText,
      pineconeIds
    });
    await document.save();

    reply.send({ message: 'File uploaded and processed successfully', documentId: document._id });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Error processing file' });
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

fastify.get('/documents', async (request, reply) => {
  const documents = await Document.find({}, 'name type size uploadDate _id');
  reply.send(documents);
});

fastify.get('/documents/:id', async (request, reply) => {
  const { id } = request.params;
  const document = await Document.findById(id);
  if (!document) {
    return reply.code(404).send({ error: 'Document not found' });
  }
  reply.send(document);
});

fastify.post('/query', async (request, reply) => {
  const { question } = request.body;
  if (!question) {
    return reply.code(400).send({ error: 'Question is required' });
  }
  const { XenovaEmbeddings } = require('./utils/xenovaEmbeddings');
  // Embed question
  const embeddings = new XenovaEmbeddings({
    model: 'Xenova/all-roberta-large-v1',
  });
  const questionVector = await embeddings.embedQuery(question);

  // Query Pinecone
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
  const queryResponse = await index.query({
    vector: questionVector,
    topK: 5,
    includeMetadata: true
  });

  const relevantTexts = queryResponse.matches.map(match => match.metadata.text);

  // Filter out empty or very short texts
  const filteredTexts = relevantTexts.filter(text => text && text.trim().length > 10);

  if (filteredTexts.length === 0) {
    return reply.send({
      answer: "I couldn't find relevant information in the uploaded documents to answer your question. Please try rephrasing your question or upload more relevant documents.",
      relevantTexts: []
    });
  }

  // Generate answer with OpenAI
  const context = filteredTexts.slice(0, 3).join('\n\n'); // Limit to top 3 results
  const prompt = `
    You are a helpful assistant that answers questions based on the provided context from documents.
    Context from documents:
    ${context}
    Question: ${question}
    Instructions:
    - Answer based ONLY on the provided context
    - If the context doesn't contain enough information to answer the question, say so
    - Be concise but comprehensive
    - Use the information from the documents to support your answer
    - If asked about something not in the context, politely explain that you don't have that information

    Answer:
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions based on document context. Always be accurate and cite information from the provided documents.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 5000,
      temperature: 0.1 // Lower temperature for more consistent answers
    });

    const answer = completion.choices[0].message.content.trim();

    reply.send({
      answer,
      relevantTexts: filteredTexts.slice(0, 3),
      sources: filteredTexts.length
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return reply.code(500).send({
      error: 'Failed to generate answer. Please check your OpenAI API key and try again.',
      details: error.message
    });
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();