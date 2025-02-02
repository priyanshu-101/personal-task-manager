import axios from 'axios';

export const gettasks = async () => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/gettask`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Failed to fetch tasks' };
        }
        throw error;
    }
}