export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  fullname: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  occupation: string;
  role: string;
}

export interface AddressPayload {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface RegisterData extends LoginData {
  fullname: string;
  cpf: string;
  phone: string;
  occupation: string;
  role: string;
  addresses: AddressPayload[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}