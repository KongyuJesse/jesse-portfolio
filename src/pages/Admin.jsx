import React, { useState, useEffect } from 'react'
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { login, verifyToken } from '../utils/api'
import { useNotifications } from '../hooks/useNotifications'
import AdminDashboard from '../components/Admin/AdminDashboard'
import AdminLogin from '../components/Admin/AdminLogin'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
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
        // If accessing base admin path, redirect to dashboard
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
          navigate('/admin/dashboard', { replace: true })
        }
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (loginData) => {
    try {
      const response = await login(loginData)
      
      localStorage.setItem('adminToken', response.token)
      setIsAuthenticated(true)
      
      addNotification({
        type: 'success',
        title: 'Welcome!',
        message: `Logged in as ${response.user.email}`
      })
      
      navigate('/admin/dashboard', { replace: true })
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: errorMessage
      })
      throw error
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    navigate('/admin', { replace: true })
    addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
          <div className="text-teal text-lg">Loading Admin Panel...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Routes>
        <Route 
          index 
          element={
            isAuthenticated ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <AdminLogin onLogin={handleLogin} />
          } 
        />
        <Route 
          path="dashboard" 
          element={
            isAuthenticated ? 
            <AdminDashboard onLogout={handleLogout} /> : 
            <Navigate to="/admin" replace />
          } 
        />
        {/* Catch all admin routes */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <Navigate to="/admin" replace />
          } 
        />
      </Routes>
    </div>
  )
}

export default Admin