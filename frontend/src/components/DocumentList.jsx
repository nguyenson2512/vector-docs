import React, { useEffect, useState } from 'react';
import { getDocuments } from '../api';

const DocumentList = ({ onSelect, refresh }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, [refresh]);

  const fetchDocs = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Documents</h3>
      <ul>
        {documents.map(doc => (
          <li key={doc._id} onClick={() => onSelect(doc._id)} style={{ cursor: 'pointer' }}>
            {doc.name} ({doc.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;