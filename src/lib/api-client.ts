import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Additional token injection will happen here when integrating auth
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const isMock = process.env.NEXT_PUBLIC_MOCK === 'true';

// Basic mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function handleMock<T>(url: string, method: string): Promise<T> {
  await delay(800); // simulate network latency
  console.log(`[MOCK] ${method} ${url}`);
  // In a real scenario, you'd route this to specific mock JSON files based on the URL.
  // For now, return a generic empty object as T to satisfy type checking.
  return {} as T;
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) return handleMock<T>(url, 'GET');
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
}

export async function post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) return handleMock<T>(url, 'POST');
  const response: AxiosResponse<T> = await apiClient.post(url, data, config);
  return response.data;
}

export async function put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) return handleMock<T>(url, 'PUT');
  const response: AxiosResponse<T> = await apiClient.put(url, data, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) return handleMock<T>(url, 'DELETE');
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
}
