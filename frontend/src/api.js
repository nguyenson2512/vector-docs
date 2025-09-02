import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const uploadFile = (formData) => axios.post(`${API_BASE}/upload`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getDocuments = () => axios.get(`${API_BASE}/documents`);

export const getDocument = (id) => axios.get(`${API_BASE}/documents/${id}`);

export const queryDocuments = (question) => axios.post(`${API_BASE}/query`, { question });