import React, { useEffect, useState } from 'react';
import { getDocument } from '../api';

const DocumentView = ({ documentId }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchDoc();
    } else {
      setDocument(null);
    }
  }, [documentId]);

  const fetchDoc = async () => {
    setLoading(true);
    try {
      const response = await getDocument(documentId);
      setDocument(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!document) return <div>Select a document to view</div>;

  return (
    <div>
      <h3>{document.name}</h3>
      <p><strong>Type:</strong> {document.type}</p>
      <p><strong>Size:</strong> {document.size} bytes</p>
      <p><strong>Extracted Text:</strong></p>
      <div style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
        {document.extractedText}
      </div>
    </div>
  );
};

export default DocumentView;