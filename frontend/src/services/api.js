import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getTodos = (status) =>
  api.get('/todos', { params: status ? { status } : {} });

export const getTodo = (id) => api.get(`/todos/${id}`);

export const createTodo = (data) => api.post('/todos', data);

export const updateTodo = (id, data) => api.put(`/todos/${id}`, data);

export const deleteTodo = (id) => api.delete(`/todos/${id}`);

export const getStats = () => api.get('/stats');

export default api;
