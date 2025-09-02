# Vector Document Processor

A full-stack web application for processing PDF and text documents using vector embeddings, Pinecone vector database, and OpenAI GPT for intelligent Q&A.

## 🚀 Features

- **📄 Document Upload**: Support for PDF and TXT file uploads
- **🔍 Text Extraction**: Automatic text extraction from uploaded documents
- **🧠 Vector Embeddings**: Local embeddings using Xenova/transformers (completely free)
- **📚 Vector Storage**: Pinecone integration for efficient vector storage and retrieval
- **💬 Intelligent Q&A**: OpenAI GPT-powered question answering based on document content
- **🎨 Modern UI**: React-based frontend with responsive design
- **🐳 Docker Support**: Complete containerization for easy deployment

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓ HTTP requests
Backend (Node.js + Fastify)
    ↓ Vector operations
Pinecone (Vector Database)
    ↓ Text generation
OpenAI GPT (Completions)
    ↓ Data persistence
MongoDB (Document Metadata)
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Docker & Docker Compose** (for containerized deployment)
- **MongoDB** (local or cloud instance)
- **Pinecone Account** (for vector storage)
- **OpenAI API Key** (for GPT completions)

## 🛠️ Installation

### Option 1: Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd vector-docs
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Option 2: Local Development

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd vector-docs
   ```

2. **Backend setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   npm run dev
   ```

3. **Frontend setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database setup**:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env`

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```bash
# OpenAI API Key for GPT completions
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone API Key and configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=your_pinecone_index_name_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/vector-docs

# Server configuration
PORT=3001
```

### API Keys Setup

1. **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Pinecone**: Get your API key from [Pinecone Console](https://app.pinecone.io/)
3. **MongoDB**: Use local MongoDB or [MongoDB Atlas](https://cloud.mongodb.com/)

## 📁 Project Structure

```
vector-docs/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.js          # API client
│   │   └── App.jsx         # Main app component
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔧 API Endpoints

### Backend API (http://localhost:3001)

#### Upload Document
```http
POST /upload
Content-Type: multipart/form-data

Form data:
- file: PDF or TXT file
```

#### List Documents
```http
GET /documents
```

#### Get Document
```http
GET /documents/:id
```

#### Query Documents (Q&A)
```http
POST /query
Content-Type: application/json

{
  "question": "What is the main topic of the document?"
}
```

## 🎯 Usage

1. **Upload Documents**: Click "Choose File" and select PDF/TXT files
2. **View Documents**: Select uploaded documents from the list to view extracted text
3. **Ask Questions**: Use the Q&A chatbot to ask questions about your documents
4. **Get Answers**: Receive AI-powered answers based on document content

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for hot reloading
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs Vite dev server
```

### Testing the API
```bash
# Test document upload
curl -X POST -F "file=@document.pdf" http://localhost:3001/upload

# Test Q&A
curl -X POST -H "Content-Type: application/json" \
  -d '{"question":"What is this document about?"}' \
  http://localhost:3001/query
```

## 🐛 Troubleshooting

### Common Issues

**1. "Vector dimension mismatch"**
- Ensure your Pinecone index dimension matches the embedding model (1024 for Xenova/all-roberta-large-v1)

**2. "OpenAI API quota exceeded"**
- Check your OpenAI usage at https://platform.openai.com/usage
- Upgrade your OpenAI plan if needed

**3. "MongoDB connection failed"**
- Ensure MongoDB is running locally or update connection string
- Check firewall settings for MongoDB port (27017)

**4. "Frontend not loading"**
- Ensure port 3000 is available
- Check if Vite dev server is running: `cd frontend && npm run dev`

**5. "Pinecone authentication failed"**
- Verify your Pinecone API key and environment
- Check Pinecone dashboard for correct index name

### Performance Tips

- **Large Documents**: Break into smaller chunks for better processing
- **Multiple Queries**: Reuse embeddings when possible
- **Memory Usage**: Monitor Node.js memory for large document processing

## 📊 Technology Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Node.js, Fastify, MongoDB
- **AI/ML**: Xenova/transformers, OpenAI GPT-3.5
- **Vector DB**: Pinecone
- **Deployment**: Docker, Docker Compose

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub

---

**Happy Document Processing! 📄✨**