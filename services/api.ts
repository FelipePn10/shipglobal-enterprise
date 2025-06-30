import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite envio de cookies
});


export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const cadastro = async (userData: { username: string; password: string; email: string }) => {
  const response = await api.post('/auth/cadastro', userData);
  return response.data;
};

// Outros endpoints do backend
export const getSomeData = async () => {
  const response = await api.get('/some-endpoint');
  return response.data;
};

export default api;