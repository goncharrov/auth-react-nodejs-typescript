import axios from 'axios';

const api = axios.create({
   baseURL: 'http://localhost:5007/api',
   withCredentials: true,
});

let csrfToken: string | null = null;

export async function initCsrf(): Promise<void> {
   const res = await api.get<{ csrfToken: string }>('/csrf-token');
   csrfToken = res.data.csrfToken;
}

api.interceptors.request.use((config) => {
   const safeMethods = ['get', 'head', 'options'];
   if (csrfToken && !safeMethods.includes(config.method?.toLowerCase() ?? '')) {
      config.headers['x-csrf-token'] = csrfToken;
   }
   return config;
});

export default api;
