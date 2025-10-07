import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)

  const navItems = [
    { name: 'Home', href: '#home', icon: '🏠' },
    { name: 'About', href: '#about', icon: '👨‍💻' },
    { name: 'Skills', href: '#skills', icon: '⚡' },
    { name: 'Projects', href: '#projects', icon: '🚀' },
    { name: 'Certificates', href: '#certificates', icon: '🏆' },
    { name: 'Contact', href: '#contact', icon: '📧' }
  ]

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fixed Active Section Observer
  useEffect(() => {
    const sections = navItems.map(item => document.querySelector(item.href))
    
    const observers = sections.map((section, index) => {
      if (!section) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(navItems[index].href.substring(1))
            }
          })
        },
        { 
          threshold: 0.3, // Reduced from 0.5 to 0.3 for better detection
          rootMargin: '-20% 0px -20% 0px' // Triggers when 30% of section is visible
        }
      )

      observer.observe(section)
      return observer
    })

    // Fallback: Update active section on scroll
    const handleScrollActive = () => {
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].href.substring(1))
          break
        }
      }
    }

    window.addEventListener('scroll', handleScrollActive)

    return () => {
      observers.forEach(observer => {
        if (observer) observer.disconnect()
      })
      window.removeEventListener('scroll', handleScrollActive)
    }
  }, [])

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-charcoal/95 backdrop-blur-xl shadow-2xl shadow-teal/10 border-b border-teal/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#home')}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal/20">
                <span className="text-charcoal font-bold text-lg">KJ</span>
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-br from-teal to-blue-500 rounded-2xl blur-sm opacity-75 -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <div className="hidden sm:block">
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Kongyu Jesse
              </motion.h1>
              <p className="text-xs text-muted-silver font-light">Full Stack Developer</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden lg:flex items-center space-x-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.substring(1)
              return (
                <motion.button
                  key={item.name}
                  variants={itemVariants}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-500 group ${
                    isActive 
                      ? 'text-teal' 
                      : 'text-soft-white hover:text-teal'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Background for active state */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-teal/10 rounded-xl border border-teal/20 backdrop-blur-sm"
                      layoutId="activeNavBackground"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => scrollToSection('#contact')}
              className="px-6 py-3 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-xl shadow-lg shadow-teal/20 hover:shadow-teal/30 transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Hire Me</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.button>
          </motion.div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button
            className="lg:hidden relative w-12 h-12 bg-charcoal/50 backdrop-blur-sm rounded-xl border border-teal/20 flex flex-col items-center justify-center space-y-1.5 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(100, 255, 218, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className={`w-6 h-0.5 bg-teal rounded-full transform origin-center transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <motion.span
              className={`w-6 h-0.5 bg-teal rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <motion.span
              className={`w-6 h-0.5 bg-teal rounded-full transform origin-center transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
            
            {/* Pulsing dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-teal rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden absolute left-6 right-6 mt-4 bg-charcoal/95 backdrop-blur-xl rounded-2xl border border-teal/20 shadow-2xl shadow-teal/10 overflow-hidden"
            >
              <div className="p-6 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.substring(1)
                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 flex items-center space-x-4 group ${
                        isActive 
                          ? 'bg-teal/10 text-teal border border-teal/20' 
                          : 'text-soft-white hover:bg-teal/5 hover:text-teal'
                      }`}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                      
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-teal rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
                
                {/* Mobile CTA Button */}
                <motion.button
                  onClick={() => scrollToSection('#contact')}
                  className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-xl shadow-lg text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Get In Touch
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar