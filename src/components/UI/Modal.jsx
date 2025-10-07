import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-teal/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-gradient-to-br from-charcoal via-navy-900 to-charcoal rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-teal/20 shadow-2xl shadow-teal/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated border */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-teal via-blue-500 to-purple-500 rounded-3xl blur-sm opacity-50 -z-10"
              animate={{
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="flex justify-between items-center p-8 border-b border-teal/20 bg-gradient-to-r from-teal/5 to-blue-500/5">
              {title && (
                <motion.h3 
                  className="text-2xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {title}
                </motion.h3>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onClose}
                  className="w-12 h-12 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                >
                  <motion.span
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✕
                  </motion.span>
                </Button>
              </motion.div>
            </div>
            <motion.div 
              className="p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal