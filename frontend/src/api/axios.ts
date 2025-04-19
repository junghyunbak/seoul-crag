import axios, { CreateAxiosDefaults } from 'axios';
import { setupTokenRefreshInterceptor } from '@/api/setupTokenRefreshInterceptor';

const axiosConfig: CreateAxiosDefaults = {
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
  },
};

const api = axios.create(axiosConfig);
const refreshApi = axios.create(axiosConfig);

setupTokenRefreshInterceptor({ api, refreshApi });

export { api };
