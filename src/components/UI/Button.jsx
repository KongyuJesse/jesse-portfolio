import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-teal/30 focus:ring-offset-2 focus:ring-offset-navy-900 relative overflow-hidden group'
  
  const variants = {
    primary: 'bg-gradient-to-r from-teal via-blue-500 to-purple-500 text-navy-900 hover:shadow-2xl hover:shadow-teal/30 hover:scale-105 transform-gpu',
    secondary: 'border-2 border-gradient-to-r from-teal to-blue-500 text-teal hover:bg-gradient-to-r hover:from-teal hover:to-blue-500 hover:text-navy-900 hover:shadow-lg hover:shadow-teal/20',
    ghost: 'text-soft-white hover:text-teal hover:bg-charcoal/70 backdrop-blur-sm hover:scale-110 transform-gpu'
  }

  const sizes = {
    small: 'px-6 py-3 text-sm',
    medium: 'px-8 py-4 text-base',
    large: 'px-10 py-5 text-lg'
  }

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform"
        animate={{ x: [-100, 300] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

export default Button