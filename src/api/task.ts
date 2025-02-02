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

export const deletetask = async (taskId) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/delete/${taskId}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Failed to delete task' };
        }
        throw error;
    }
}

export const updatetask = async (taskId, title, desc , st, priority, date, id) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const payload = 
            {
                "title": title,
                "description": desc,
                "status": st,
                "priority": priority,
                "dueDate": date,
                "projectId": id
            }
        
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/update/${taskId}`, payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Failed to update task' };
        }
        throw error;
    }
}