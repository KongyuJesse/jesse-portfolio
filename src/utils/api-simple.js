const API_BASE_URL = 'http://localhost:5000/api'

// Simple API functions for testing
export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }
      
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Auth
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  async verifyToken() {
    return this.request('/auth/verify')
  },

  // Data
  async getProjects() {
    return this.request('/projects')
  },

  async getSkills() {
    return this.request('/skills')
  },

  async getCertificates() {
    return this.request('/certificates')
  },

  async getAboutContent() {
    return this.request('/about')
  },

  async getResume() {
    return this.request('/resume')
  },

  // Messages
  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }
}

export default api