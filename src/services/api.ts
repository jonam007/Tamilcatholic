import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'https://legendary-system-gpjj9545qw259q-5000.app.github.dev' || 'http://localhost:5000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Bible API
export const bibleAPI = {
  getBooks: () => api.get('/bible/books'),
  getBook: (bookId: string) => api.get(`/bible/books/${bookId}`),
  getChapter: (bookId: string, chapterNum: number) => 
    api.get(`/bible/books/${bookId}/chapters/${chapterNum}`),
  searchVerses: (query: string, limit = 20) => 
    api.get(`/bible/search?query=${encodeURIComponent(query)}&limit=${limit}`),
};

// Daily Readings API
export const readingsAPI = {
  getReadingsByDate: (date: string) => api.get(`/readings/date/${date}`),
  getReadingsRange: (startDate: string, endDate: string) => 
    api.get(`/readings/range?startDate=${startDate}&endDate=${endDate}`),
  createReading: (data: any) => api.post('/readings', data),
  updateReading: (id: string, data: any) => api.put(`/readings/${id}`, data),
  deleteReading: (id: string) => api.delete(`/readings/${id}`),
};

// Prayer Requests API
export const prayersAPI = {
  getPrayers: (page = 1, limit = 10, category = 'all') => 
    api.get(`/prayers?page=${page}&limit=${limit}&category=${category}`),
  submitPrayer: (data: any) => api.post('/prayers', data),
  getPendingPrayers: (page = 1, limit = 10) => 
    api.get(`/prayers/pending?page=${page}&limit=${limit}`),
  approvePrayer: (id: string) => api.put(`/prayers/${id}/approve`),
  deletePrayer: (id: string) => api.delete(`/prayers/${id}`),
};

// Blog API
export const blogAPI = {
  getPosts: (page = 1, limit = 10, category = 'all', tag?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category !== 'all' && { category }),
      ...(tag && { tag })
    });
    return api.get(`/blog?${params}`);
  },
  getPost: (slug: string) => api.get(`/blog/${slug}`),
  createPost: (data: any) => api.post('/blog', data),
  updatePost: (id: string, data: any) => api.put(`/blog/${id}`, data),
  deletePost: (id: string) => api.delete(`/blog/${id}`),
  getAllPostsForAdmin: (page = 1, limit = 10) => 
    api.get(`/blog/admin/all?page=${page}&limit=${limit}`),
};

// Search API
export const searchAPI = {
  search: (query: string, type = 'all', limit = 10) => 
    api.get(`/search?query=${encodeURIComponent(query)}&type=${type}&limit=${limit}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1, limit = 10) => 
    api.get(`/admin/users?page=${page}&limit=${limit}`),
  updateUserRole: (id: string, role: string) => 
    api.put(`/admin/users/${id}/role`, { role }),
  getAnalytics: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get(`/admin/analytics?${params}`);
  },
};

export default api;