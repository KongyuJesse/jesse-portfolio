// src/pages/Admin.jsx (Updated)
import React, { useState, useEffect } from 'react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import { login, verifyToken } from '../utils/api'
import { useNotifications } from '../hooks/useNotifications'
import NotificationContainer from '../components/UI/Notification'
import AdminDashboard from '../components/Admin/AdminDashboard'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) {
        await verifyToken()
        setIsAuthenticated(true)
        // If already on dashboard, stay there
        if (location.pathname === '/admin') {
          navigate('/admin/dashboard')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const response = await login(loginData)
      
      localStorage.setItem('adminToken', response.token)
      setIsAuthenticated(true)
      
      addNotification({
        type: 'success',
        title: 'Welcome!',
        message: `Logged in as ${response.user.email}`
      })
      
      // Navigate to dashboard
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      setLoginError(errorMessage)
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: errorMessage
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    navigate('/admin')
    addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-teal text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-charcoal rounded-xl p-8 shadow-2xl border border-teal/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-teal">Admin Portal</h2>
              <p className="text-muted-silver mt-2">Access your portfolio management dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-soft-white mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="Enter your admin email"
                  required
                />
              </div>
              <div>
                <label className="block text-soft-white mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <span>⚠️</span>
                    <span className="text-sm">{loginError}</span>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-teal text-navy-900 py-3 rounded-lg font-semibold hover:bg-teal/90 transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy-900"
              >
                Sign In to Dashboard
              </button>
              
              <div className="text-center">
                <p className="text-sm text-muted-silver">
                  Contact system administrator for access credentials
                </p>
              </div>
            </form>
          </div>
        </div>
        <NotificationContainer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard onLogout={handleLogout} />} />
        <Route path="/" element={<AdminDashboard onLogout={handleLogout} />} />
      </Routes>
      <NotificationContainer />
    </div>
  )
}

export default Admin