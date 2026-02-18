import axios from 'axios';
import { LegalQuery, LegalResponse } from '../types/index';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const legalAPI = {
  submitQuery: async (query: LegalQuery, file?: File): Promise<LegalResponse> => {
    if (file) {
      // Handle file upload with FormData
      const formData = new FormData();
      formData.append('userId', query.userId);
      formData.append('caseType', query.caseType);
      formData.append('location', query.location);
      formData.append('description', query.description);
      formData.append('language', query.language);
      formData.append('document', file);
      
      const response = await apiClient.post('/legal/query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } else {
      // Regular text query
      const response = await apiClient.post('/legal/query', query);
      return response.data.data;
    }
  },

  getChatHistory: async (userId: string) => {
    const response = await apiClient.get(`/chat/history/${userId}`);
    return response.data.data;
  },

  saveChatMessage: async (userId: string, caseType: string, location: string, description: string) => {
    const response = await apiClient.post('/chat/save', {
      userId,
      caseType,
      location,
      description,
    });
    return response.data.data;
  },

  deleteChatHistory: async (userId: string) => {
    const response = await apiClient.delete(`/chat/history/${userId}`);
    return response.data;
  },
};

export default apiClient;
