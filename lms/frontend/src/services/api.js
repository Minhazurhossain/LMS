import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
  forgotPassword: (email) => api.post('/auth/password/forgot/', { email }),
  resetPassword: (data) => api.post('/auth/password/reset/', data),
  changePassword: (data) => api.post('/auth/password/change/', data),
};

export const lmsAPI = {
  getCategories: () => api.get('/lms/categories/'),
  getCategory: (id) => api.get(`/lms/categories/${id}/`),
  createCategory: (data) => api.post('/lms/categories/', data),
  updateCategory: (id, data) => api.put(`/lms/categories/${id}/`, data),
  deleteCategory: (id) => api.delete(`/lms/categories/${id}/`),
  getCourses: (params) => api.get('/lms/courses/', { params }),
  getCourse: (id) => api.get(`/lms/courses/${id}/`),
  createCourse: (data) => api.post('/lms/courses/', data),
  updateCourse: (id, data) => api.put(`/lms/courses/${id}/`, data),
  deleteCourse: (id) => api.delete(`/lms/courses/${id}/`),
  getMyCourses: () => api.get('/lms/courses/my_courses/'),
  enrollCourse: (id) => api.post(`/lms/courses/${id}/enroll/`),
  getEnrollments: () => api.get('/lms/enrollments/'),
  getEnrollment: (id) => api.get(`/lms/enrollments/${id}/`),
  updateProgress: (id, progress) => 
    api.post(`/lms/enrollments/${id}/update_progress/`, { progress_percentage: progress }),
  getLessons: (courseId) => api.get('/lms/lessons/', { params: { course: courseId } }),
  createLesson: (data) => api.post('/lms/lessons/', data),
  getDashboardStats: () => api.get('/lms/dashboard/stats/'),
  getAdminReports: () => api.get('/lms/reports/admin/'),
};

export default api;
