import axios from "axios";

export const updateuser = async (name, email, password) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const payload =
        {
            "name": name,
            "email": email,
            "password": password
        }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update`, payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Failed to update user' };
        }
        throw error;
    }
}