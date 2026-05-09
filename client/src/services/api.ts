import axios from 'axios';
import type { BusinessFormData, GenerateResponse, HistoryResponse, Project } from '../types';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s for LLM generation
  headers: { 'Content-Type': 'application/json' }
});

export async function generateContent(data: BusinessFormData): Promise<GenerateResponse> {
  const response = await api.post<GenerateResponse>('/generate', data);
  return response.data;
}

export async function getHistory(): Promise<Project[]> {
  const response = await api.get<HistoryResponse>('/history');
  return response.data.data;
}

export async function getProjectById(id: number): Promise<Project> {
  const response = await api.get<{ success: boolean; data: Project }>(`/history/${id}`);
  return response.data.data;
}
