// src/components/Admin/AdminDashboard.jsx (Fixed)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectManager from './ProjectManager';
import CertificateManager from './CertificateManager';
import SkillManager from './SkillManager';
import ResumeManager from './ResumeManager';
import AboutManager from './AboutManager';
import MessageManager from './MessageManager';
import DashboardStats from './DashboardStats';
import { useNotifications } from '../../hooks/useNotifications';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { addNotification } = useNotifications();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'projects', name: 'Projects', icon: '💼' },
    { id: 'certificates', name: 'Certificates', icon: '🏆' },
    { id: 'skills', name: 'Skills', icon: '🛠️' },
    { id: 'resume', name: 'Resume', icon: '📄' },
    { id: 'about', name: 'About', icon: '👤' },
    { id: 'messages', name: 'Messages', icon: '✉️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'projects':
        return <ProjectManager />;
      case 'certificates':
        return <CertificateManager />;
      case 'skills':
        return <SkillManager />;
      case 'resume':
        return <ResumeManager />;
      case 'about':
        return <AboutManager />;
      case 'messages':
        return <MessageManager />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
      <header className="bg-charcoal border-b border-muted-silver/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-teal">Admin Dashboard</h1>
              <p className="text-muted-silver text-sm">Manage your portfolio content</p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                View Portfolio
              </a>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <nav className="flex space-x-1 mb-8 bg-charcoal/50 rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-md capitalize transition-colors whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-teal text-navy-900 font-semibold'
                  : 'text-soft-white hover:text-teal hover:bg-teal/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal/30 rounded-xl p-6 min-h-96"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;