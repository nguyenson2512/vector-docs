import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import DocumentView from './components/DocumentView';
import QueryChat from './components/QueryChat';
import './App.css';

function App() {
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleUpload = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleSelectDocument = (id) => {
    setSelectedDocumentId(id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vector Document Processor</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <FileUpload onUpload={handleUpload} />
          <DocumentList onSelect={handleSelectDocument} refresh={refreshList} />
        </div>
        <div style={{ flex: 2 }}>
          <DocumentView documentId={selectedDocumentId} />
        </div>
        <div style={{ flex: 1 }}>
          <QueryChat />
        </div>
      </div>
    </div>
  );
}

export default App;
