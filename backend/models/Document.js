const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['pdf', 'txt']
  },
  size: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  extractedText: {
    type: String,
    required: true
  },
  pineconeIds: [{
    type: String
  }],
  userId: {
    type: String,
    default: 'default-user' // For simplicity, assuming single user
  }
});

module.exports = mongoose.model('Document', documentSchema);