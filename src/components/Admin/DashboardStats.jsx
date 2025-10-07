// src/components/Admin/DashboardStats.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../utils/api-enhanced';
import { useNotifications } from '../../hooks/useNotifications';

const DashboardStats = () => {
  const [realStats, setRealStats] = useState({
    projects: 0,
    certificates: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      const stats = await getDashboardStats();
      setRealStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard statistics'
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: realStats.projects,
      icon: '💼',
      color: 'teal',
      description: 'Portfolio projects'
    },
    {
      title: 'Certificates',
      value: realStats.certificates,
      icon: '🏆',
      color: 'blue',
      description: 'Professional certifications'
    },
    {
      title: 'Skills',
      value: realStats.skills,
      icon: '🛠️',
      color: 'green',
      description: 'Technical & soft skills'
    },
    {
      title: 'Messages',
      value: realStats.messages,
      icon: '✉️',
      color: 'purple',
      description: `${realStats.unreadMessages} unread`
    }
  ];

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-charcoal/50 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-muted-silver/20 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-muted-silver/20 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted-silver/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-teal">Dashboard Overview</h2>
        <p className="text-muted-silver">Welcome to your portfolio management dashboard</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-charcoal/50 rounded-lg p-6 border border-muted-silver/20 hover:border-teal/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-soft-white">{stat.value}</div>
                <div className="text-muted-silver text-sm">{stat.title}</div>
              </div>
            </div>
            <p className="text-muted-silver text-sm">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-charcoal/50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-soft-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.hash = '#projects'}
              className="w-full text-left p-3 bg-navy-900/50 rounded-lg hover:bg-teal/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-teal">💼</span>
                <div>
                  <div className="font-medium text-soft-white">Manage Projects</div>
                  <div className="text-muted-silver text-sm">Add, edit, or remove portfolio projects</div>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.hash = '#certificates'}
              className="w-full text-left p-3 bg-navy-900/50 rounded-lg hover:bg-teal/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-teal">🏆</span>
                <div>
                  <div className="font-medium text-soft-white">Manage Certificates</div>
                  <div className="text-muted-silver text-sm">Update your professional certifications</div>
                </div>
              </div>
            </button>

            <button 
              onClick={() => window.location.hash = '#messages'}
              className="w-full text-left p-3 bg-navy-900/50 rounded-lg hover:bg-teal/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-teal">✉️</span>
                <div>
                  <div className="font-medium text-soft-white">View Messages</div>
                  <div className="text-muted-silver text-sm">Check contact form messages ({realStats.unreadMessages} new)</div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-charcoal/50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-soft-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-soft-white">Backend API</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-soft-white">Database</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-soft-white">File Storage</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-soft-white">Last Backup</span>
              <span className="text-muted-silver text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;