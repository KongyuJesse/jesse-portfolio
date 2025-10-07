// utils/api-enhanced.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jesse-portfolio-wslg.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Enhanced API functions
export const contentAPI = {
  // Content management
  getContent: () => api.get('/content'),
  updateContent: (data) => api.put('/content', data),

  // Projects
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Certificates
  getCertificates: () => api.get('/certificates'),
  createCertificate: (data) => api.post('/certificates', data),
  updateCertificate: (id, data) => api.put(`/certificates/${id}`, data),
  deleteCertificate: (id) => api.delete(`/certificates/${id}`),

  // Skills
  getSkills: () => api.get('/skills'),
  updateSkills: (skills) => api.put('/skills', { skills }),

  // Messages
  getMessages: () => api.get('/messages'),
  markMessageAsRead: (id) => api.patch(`/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/messages/${id}`),

  // Resume
  getResume: () => api.get('/resume'),
  getAllResumes: () => api.get('/resume/all'),
  uploadResume: (data) => api.post('/resume', data),
  activateResume: (id) => api.patch(`/resume/${id}/activate`),
  deleteResume: (id) => api.delete(`/resume/${id}`),

  // Upload
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadDocument: (formData) => api.post('/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Statistics
export const getDashboardStats = async () => {
  try {
    const [projects, certificates, messages, skills] = await Promise.all([
      contentAPI.getProjects(),
      contentAPI.getCertificates(),
      contentAPI.getMessages(),
      contentAPI.getSkills()
    ]);

    return {
      projects: projects.data.length,
      certificates: certificates.data.length,
      messages: messages.data.length,
      skills: skills.data.length,
      unreadMessages: messages.data.filter(m => !m.read).length
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      projects: 0,
      certificates: 0,
      messages: 0,
      skills: 0,
      unreadMessages: 0
    };
  }
};

export default contentAPI;