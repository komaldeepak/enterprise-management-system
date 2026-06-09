import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const { token } = JSON.parse(auth);
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),

  // Employees
  getEmployees: () => apiClient.get('/employees'),
  getEmployee: (id: string) => apiClient.get(`/employees/${id}`),
  createEmployee: (data: any) => apiClient.post('/employees', data),
  updateEmployee: (id: string, data: any) =>
    apiClient.put(`/employees/${id}`, data),
  deleteEmployee: (id: string) => apiClient.delete(`/employees/${id}`),

  // Departments
  getDepartments: () => apiClient.get('/departments'),
  getDepartment: (id: string) => apiClient.get(`/departments/${id}`),
  createDepartment: (data: any) => apiClient.post('/departments', data),
  updateDepartment: (id: string, data: any) =>
    apiClient.put(`/departments/${id}`, data),
  deleteDepartment: (id: string) => apiClient.delete(`/departments/${id}`),

  // Projects
  getProjects: () => apiClient.get('/projects'),
  getProject: (id: string) => apiClient.get(`/projects/${id}`),
  createProject: (data: any) => apiClient.post('/projects', data),
  updateProject: (id: string, data: any) =>
    apiClient.put(`/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/projects/${id}`),

  // Analytics
  getDashboardStats: () => apiClient.get('/analytics/stats'),
  getChartData: (type: string) => apiClient.get(`/analytics/charts/${type}`),
};

export default apiClient;
