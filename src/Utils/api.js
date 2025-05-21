import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_WEBSITE_NODE,
   withCredentials: true, 
});

export default api;
