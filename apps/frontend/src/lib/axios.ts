import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_ENABLE_MSW === 'true' ? undefined : import.meta.env.VITE_BACKEND_SERVER_URL,
});