import axios from 'axios';

interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const payload: RegisterUserPayload = {
      name,
      email,
      password
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { message: 'Registration failed' };
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const payload = { email, password };
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, payload);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { message: 'Login failed' };
    }
    throw error;
  }
}