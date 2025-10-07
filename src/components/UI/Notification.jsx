import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../../hooks/useNotifications'

const Notification = ({ notification }) => {
  const { removeNotification } = useNotifications()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(notification.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, removeNotification])

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '💡'
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 border-l-4 border-green-500'
      case 'error':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/10 border-l-4 border-red-500'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-l-4 border-yellow-500'
      case 'info':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border-l-4 border-blue-500'
      default:
        return 'bg-gradient-to-r from-charcoal to-navy-900/80 border-l-4 border-teal'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className={`p-6 rounded-2xl ${getBackgroundColor(notification.type)} shadow-2xl backdrop-blur-sm mb-4 min-w-80 border border-white/10 relative overflow-hidden`}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform"
        animate={{ x: [-100, 400] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start space-x-4">
          <motion.span 
            className="text-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getIcon(notification.type)}
          </motion.span>
          <div>
            <motion.h4 
              className="font-bold text-soft-white text-lg mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {notification.title}
            </motion.h4>
            <motion.p 
              className="text-muted-silver text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {notification.message}
            </motion.p>
          </div>
        </div>
        <motion.button
          onClick={() => removeNotification(notification.id)}
          className="text-muted-silver hover:text-soft-white transition-all duration-300 ml-4 p-2 rounded-lg hover:bg-white/10"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal to-blue-500 rounded-full"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  )
}

const NotificationContainer = () => {
  const { notifications } = useNotifications()

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationContainer