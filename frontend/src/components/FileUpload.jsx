import React, { useState } from 'react';
import { uploadFile } from '../api';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await uploadFile(formData);
      onUpload(response.data);
      setFile(null); // Reset file
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Document</h3>
      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload;