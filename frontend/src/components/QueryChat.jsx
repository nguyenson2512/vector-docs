import React, { useState } from 'react';
import { queryDocuments } from '../api';

const QueryChat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await queryDocuments(question);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      setAnswer('Error occurred while querying.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Q&A Chatbot</h3>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the documents"
        style={{ width: '100%', padding: '8px' }}
      />
      <button onClick={handleQuery} disabled={loading} style={{ marginTop: '8px' }}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && (
        <div style={{ marginTop: '16px', padding: '8px', border: '1px solid #ccc' }}>
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default QueryChat;