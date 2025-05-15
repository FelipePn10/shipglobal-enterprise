import apiClient from '../client';
import type { AuthResponse, RegisterData } from './types/auth';


export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('public/auth/register', data);
  return response.data;
};