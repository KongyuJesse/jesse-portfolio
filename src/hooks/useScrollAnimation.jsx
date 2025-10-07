import { useRef, useEffect } from 'react'
import { useAnimation, useInView } from 'framer-motion'

export const useScrollAnimation = (threshold = 0.1, triggerOnce = true) => {
  const ref = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { threshold, triggerOnce })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  return { ref, controls }
}

export default useScrollAnimation