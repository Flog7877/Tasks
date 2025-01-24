import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const todosAPI = {
    getAll: async () => {
        const response = await api.get('/todos');
        return response.data;
    },
    create: async (todo) => {
        const response = await api.post('/todos', todo);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    },
};

export const categoriesAPI = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },
    create: async (category) => {
        const response = await api.post('/categories', category);
        return response.data;
    },
};

export default api;
