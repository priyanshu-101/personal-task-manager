import axios from 'axios';

interface CreateProjectPayload {
    name: string;
    description: string;
}

export const createProject = async (name: string, description: string) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        const payload: CreateProjectPayload = {
            name,
            description
        };

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`, payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Project creation failed' };
        }
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/allprojects`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Failed to fetch projects' };
        }
        throw error;
    }
};

export const deleteProject = async (projectId: string) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            data: {
                id: projectId
            }
        });
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data || { message: 'Failed to delete project' };
        }
        throw error;
    }
}