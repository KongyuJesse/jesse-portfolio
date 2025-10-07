// src/App.jsx (Updated)
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Unsubscribe from './pages/Unsubscribe'
import { NotificationProvider } from './hooks/useNotifications'
import NotificationContainer from './components/UI/Notification'

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App font-inter bg-navy-900 text-soft-white min-h-screen">
          <NotificationContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  )
}

export default App