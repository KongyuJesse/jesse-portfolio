// src/components/Admin/AdminLogin.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const AdminLogin = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoading(true)
    
    try {
      await onLogin(loginData)
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-soft-white mb-2 font-medium">Email Address</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Enter your admin email"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-soft-white mb-2 font-medium">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-2 text-red-400">
                  <span>⚠️</span>
                  <span className="text-sm font-medium">{loginError}</span>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal to-cyan-500 text-navy-900 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-muted-silver">
                Login To make Changes
              </p>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-teal hover:text-teal/80 transition-colors font-medium"
          >
            <span>←</span>
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin