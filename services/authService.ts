import { api } from './api';

interface RegisterPayload {
    fullname: string;
    email: string;
    password: string;
    cpf: string;
    phone: string;
    address: string;
    complement: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    occupation: string;
}

interface LoginPayload {
    email: string;
    senha: string;
}

interface LoginResponse {
    accessToken: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    const response = await api.post('/usuarios', payload);
    return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
};