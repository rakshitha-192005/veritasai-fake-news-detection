import axios from 'axios';
import { PredictionResponse, AnalyticsData } from '../types';

const API_BASE_URL = '/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Detection APIs
  analyzeText: async (text: string, title?: string, language: string = 'en', input_type: string = 'text'): Promise<PredictionResponse> => {
    const res = await client.post('/detect/analyze', { text, title, language, input_type });
    return res.data;
  },

  uploadImageOCR: async (file: File): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/ocr/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadDocumentPDF: async (file: File): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/ocr/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Analytics & History
  getAnalytics: async (): Promise<AnalyticsData> => {
    const res = await client.get('/analytics/overview');
    return res.data;
  },

  getHistory: async (search?: string, verdict?: string, bookmarked?: boolean) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (verdict) params.append('verdict', verdict);
    if (bookmarked) params.append('bookmarked_only', 'true');
    const res = await client.get(`/history/list?${params.toString()}`);
    return res.data;
  },

  toggleBookmark: async (id: string) => {
    const res = await client.post(`/history/bookmark/${id}`);
    return res.data;
  },

  deleteHistoryItem: async (id: string) => {
    const res = await client.delete(`/history/delete/${id}`);
    return res.data;
  },

  // Chat Assistant
  queryAssistant: async (message: string, context_prediction?: any) => {
    const res = await client.post('/chat/query', { message, context_prediction });
    return res.data;
  },

  // Export
  getExportPdfUrl: (id: string) => `${API_BASE_URL}/export/pdf/${id}`,
  getExportCsvUrl: (id: string) => `${API_BASE_URL}/export/csv/${id}`,
  getExportJsonUrl: (id: string) => `${API_BASE_URL}/export/json/${id}`,

  // Admin
  getAdminUsers: async () => {
    const res = await client.get('/admin/users');
    return res.data;
  },
  retrainModel: async () => {
    const res = await client.post('/admin/retrain-model');
    return res.data;
  }
};
