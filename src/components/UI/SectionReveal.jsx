import React from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const SectionReveal = ({ children, delay = 0, className = '', threshold = 0.1 }) => {
  const { ref, controls } = useScrollAnimation(threshold)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 80,
          scale: 0.9,
          rotateX: 10
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            duration: 1.2,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }
      }}
      className={className}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  )
}

export default SectionReveal