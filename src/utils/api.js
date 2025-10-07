// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
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

// Messages API with better error handling
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (error.response?.status === 400) {
      const serverMessage = error.response.data?.message;
      const validationErrors = error.response.data?.errors;
      
      const errorMessage = validationErrors 
        ? validationErrors.join(', ')
        : serverMessage || 'Please check your input and try again';
      
      throw new Error(errorMessage);
    }
    
    // Network or server errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to send message. Please try again.');
  }
};

export const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const markMessageAsRead = async (id) => {
  const response = await api.patch(`/messages/${id}/read`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};

// Auth API
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

// Projects API
export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Skills API
export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

export const updateSkills = async (skills) => {
  const response = await api.put('/skills', { skills });
  return response.data;
};

// Certificates API
export const getCertificates = async () => {
  const response = await api.get('/certificates');
  return response.data;
};

export const createCertificate = async (certificateData) => {
  const response = await api.post('/certificates', certificateData);
  return response.data;
};

export const updateCertificate = async (id, certificateData) => {
  const response = await api.put(`/certificates/${id}`, certificateData);
  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await api.delete(`/certificates/${id}`);
  return response.data;
};

// About Content API
export const getAboutContent = async () => {
  const response = await api.get('/about');
  return response.data;
};

export const updateAboutContent = async (content) => {
  const response = await api.put('/about', content);
  return response.data;
};

// Resume API
export const getResume = async () => {
  const response = await api.get('/resume');
  return response.data;
};

export const getAllResumes = async () => {
  const response = await api.get('/resume/all');
  return response.data;
};

export const uploadResume = async (resumeData) => {
  const response = await api.post('/resume', resumeData);
  return response.data;
};

export const activateResume = async (id) => {
  const response = await api.patch(`/resume/${id}/activate`);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/resume/${id}`);
  return response.data;
};

// Upload API
export const uploadImage = async (formData) => {
  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await api.post('/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Add these functions to your api.js file

// Newsletter API
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Subscription failed');
    }
    throw new Error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
  }
};

export const unsubscribeFromNewsletter = async (token) => {
  const response = await api.post('/newsletter/unsubscribe', { token });
  return response.data;
};

export const getSubscribers = async () => {
  const response = await api.get('/newsletter/subscribers');
  return response.data;
};

// Export the axios instance as a named export
export { api };

export default {
  login,
  verifyToken,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  updateSkills,
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  sendMessage,
  getMessages,
  markMessageAsRead,
  deleteMessage,
  getAboutContent,
  updateAboutContent,
  getResume,
  getAllResumes,
  uploadResume,
  activateResume,
  deleteResume,
  uploadImage,
  uploadDocument,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getSubscribers,
};