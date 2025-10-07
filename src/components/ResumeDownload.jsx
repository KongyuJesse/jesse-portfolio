import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getResume } from '../utils/api'
import { useNotifications } from '../hooks/useNotifications'

const ResumeDownload = () => {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const { addNotification } = useNotifications()

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    try {
      const resumeData = await getResume()
      setResume(resumeData)
    } catch (error) {
      console.error('Error fetching resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (resume && resume.fileUrl) {
      const link = document.createElement('a')
      link.href = resume.fileUrl
      link.download = resume.fileName || 'resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      addNotification({
        type: 'success',
        title: 'Download Started',
        message: 'Your resume download has started'
      })
    } else {
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: 'Resume file not available'
      })
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <motion.div 
        className="bg-charcoal/30 rounded-2xl p-8 backdrop-blur-sm border border-teal/10 animate-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="h-8 bg-muted-silver/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted-silver/10 rounded w-1/2 mb-6"></div>
        <div className="h-12 bg-muted-silver/10 rounded w-full"></div>
      </motion.div>
    )
  }

  if (!resume) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-charcoal/30 rounded-2xl p-8 backdrop-blur-sm border border-muted-silver/20 text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-6xl mb-6"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📄
        </motion.div>
        <h3 className="text-2xl font-semibold text-soft-white mb-4">Resume Available Upon Request</h3>
        <p className="text-muted-silver text-lg mb-6">Please contact me for my latest resume</p>
        <motion.button
          onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-3 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/20 transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Me
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-charcoal/30 rounded-2xl p-8 backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 group relative overflow-hidden"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      />

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform"
        animate={{ x: isHovered ? [0, 400] : 0 }}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1">
            <motion.h3 
              className="text-2xl font-bold text-soft-white mb-4 flex items-center"
              whileHover={{ x: 5 }}
            >
              <motion.span 
                className="mr-3"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                📄
              </motion.span>
              {resume.title || 'Professional Resume'}
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {resume.fileName && (
                <motion.div 
                  className="flex items-center space-x-3 p-3 bg-charcoal/50 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-teal text-lg">📄</span>
                  <div>
                    <p className="text-sm text-muted-silver">File</p>
                    <p className="text-soft-white font-medium">{resume.fileName}</p>
                  </div>
                </motion.div>
              )}
              {resume.fileSize && (
                <motion.div 
                  className="flex items-center space-x-3 p-3 bg-charcoal/50 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-blue-400 text-lg">💾</span>
                  <div>
                    <p className="text-sm text-muted-silver">Size</p>
                    <p className="text-soft-white font-medium">{formatFileSize(resume.fileSize)}</p>
                  </div>
                </motion.div>
              )}
              {resume.version && (
                <motion.div 
                  className="flex items-center space-x-3 p-3 bg-charcoal/50 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-green-400 text-lg">🔄</span>
                  <div>
                    <p className="text-sm text-muted-silver">Version</p>
                    <p className="text-soft-white font-medium">v{resume.version}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {resume.description && (
              <motion.p 
                className="text-muted-silver text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {resume.description}
              </motion.p>
            )}
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row lg:flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleDownload}
              className="px-8 py-4 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/20 transition-all duration-300 flex items-center justify-center space-x-3 group relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📥
              </motion.span>
              <span>Download Resume</span>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.button>
            
            <motion.button
              onClick={() => window.open(resume.fileUrl, '_blank')}
              className="px-8 py-4 border-2 border-teal text-teal font-semibold rounded-xl hover:bg-teal hover:text-navy-900 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                👁️
              </motion.span>
              <span>Preview</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Last Updated */}
        {resume.updatedAt && (
          <motion.div 
            className="mt-6 pt-6 border-t border-teal/10 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-muted-silver text-sm">
              Last updated: {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Latest Version</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ResumeDownload