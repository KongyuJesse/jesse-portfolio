import React from 'react'
import { motion } from 'framer-motion'
import { XIcon, GitHubIcon, LinkedInIcon, EmailIcon } from './UI/SocialIcons'
import NewsletterForm from './UI/NewsletterForm'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/kongyu-jesse-ntani-43a9b6323/',
      icon: 'linkedin',
      color: 'hover:bg-blue-600'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/KongyuJesse',
      icon: 'github',
      color: 'hover:bg-gray-700'
    },
    {
      name: 'X/Twitter',
      url: 'https://x.com/Prof1Jesse',
      icon: 'x',
      color: 'hover:bg-sky-500'
    },
    {
      name: 'Email',
      url: 'mailto:kongyujesse@gmail.com',
      icon: 'email',
      color: 'hover:bg-red-500'
    }
  ]

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ]

  const getIconComponent = (iconName) => {
    const iconProps = { className: "w-5 h-5" }
    
    switch (iconName) {
      case 'linkedin': return <LinkedInIcon {...iconProps} />
      case 'github': return <GitHubIcon {...iconProps} />
      case 'x': return <XIcon {...iconProps} />
      case 'email': return <EmailIcon {...iconProps} />
      default: return null
    }
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <footer className="bg-gradient-to-br from-navy-900 to-charcoal relative overflow-hidden border-t border-teal/10">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #64FFDA 1px, transparent 1px),
              linear-gradient(to bottom, #64FFDA 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <motion.h3 
                className="text-4xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Jesse Kongyu
              </motion.h3>
              <motion.p 
                className="text-xl text-muted-silver leading-relaxed mb-8 max-w-2xl font-light"
                variants={itemVariants}
              >
                Full-Stack Developer & AI Enthusiast crafting innovative digital solutions 
                that bridge creativity with cutting-edge technology.
              </motion.p>
              
              {/* Social Links */}
              <motion.div 
                className="flex space-x-4"
                variants={itemVariants}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-charcoal/50 backdrop-blur-sm border border-teal/20 rounded-xl flex items-center justify-center text-soft-white transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ 
                      y: -4,
                      scale: 1.1,
                      rotate: 360
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getIconComponent(social.icon)}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-2xl font-semibold text-soft-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-lg text-muted-silver hover:text-teal transition-colors duration-300 flex items-center group font-light"
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="w-2 h-2 bg-teal rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-2xl font-semibold text-soft-white mb-6">Get In Touch</h4>
              <div className="space-y-4">
                <motion.a
                  href="mailto:kongyujesse@gmail.com"
                  className="block text-lg text-muted-silver hover:text-teal transition-colors duration-300 font-light group"
                  whileHover={{ x: 8 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <EmailIcon className="w-5 h-5 text-teal" />
                    </div>
                    <span>kongyujesse@gmail.com</span>
                  </div>
                </motion.a>
                
                <motion.div 
                  className="text-lg text-muted-silver font-light group cursor-pointer"
                  whileHover={{ x: 8 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-blue-400">📍</span>
                    </div>
                    <span>Available Worldwide</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Newsletter Section - Updated with functional form */}
          <motion.div
            className="bg-gradient-to-r from-teal/10 to-blue-500/10 rounded-3xl p-8 mb-12 backdrop-blur-sm border border-teal/20 relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <motion.div variants={itemVariants}>
                  <h4 className="text-3xl font-bold text-soft-white mb-4">
                    Stay Updated
                  </h4>
                  <p className="text-xl text-muted-silver font-light">
                    Get notified about my latest projects and tech insights.
                  </p>
                </motion.div>
                
                <NewsletterForm />
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="pt-8 border-t border-teal/10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-muted-silver font-light text-lg"
              variants={itemVariants}
            >
              © {currentYear} Jesse Kongyu. All rights reserved.
            </motion.div>
            
            <motion.div 
              className="flex space-x-8 text-sm"
              variants={itemVariants}
            >
              <motion.a
                href="#privacy"
                className="text-muted-silver hover:text-teal transition-colors duration-300 font-light"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#terms"
                className="text-muted-silver hover:text-teal transition-colors duration-300 font-light"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#cookies"
                className="text-muted-silver hover:text-teal transition-colors duration-300 font-light"
                whileHover={{ y: -2 }}
              >
                Cookies
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-teal to-blue-500 text-charcoal rounded-2xl flex items-center justify-center shadow-lg hover:shadow-teal/20 transition-all duration-300 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↑
          </motion.span>
        </motion.button>
      </div>
    </footer>
  )
}

export default Footer