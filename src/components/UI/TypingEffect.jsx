import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TypingEffect = ({ texts, speed = 100, delay = 1000 }) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      const timeout = setTimeout(() => {
        if (currentIndex <= texts[currentTextIndex].length) {
          setCurrentText(texts[currentTextIndex].slice(0, currentIndex))
          setCurrentIndex(currentIndex + 1)
        } else {
          setTimeout(() => {
            setCurrentIndex(0)
            setCurrentTextIndex((currentTextIndex + 1) % texts.length)
          }, delay)
        }
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, currentTextIndex, texts, speed, delay])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-teal font-medium"
    >
      {currentText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </motion.span>
  )
}

export default TypingEffect