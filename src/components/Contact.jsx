import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SectionReveal from './UI/SectionReveal'
import Button from './UI/Button'
import { useNotifications } from '../hooks/useNotifications'
import { sendMessage } from '../utils/api'
import { XIcon, GitHubIcon, LinkedInIcon, EmailIcon } from './UI/SocialIcons'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotifications()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendMessage(formData);
      addNotification({
        type: 'success',
        title: 'Message Sent!',
        message: 'Thank you for your message. I will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Send message error:', error);
      addNotification({
        type: 'error',
        title: 'Error Sending Message',
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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

  const getIconComponent = (iconName) => {
    const iconProps = { className: "w-6 h-6" }
    
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
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-br from-charcoal/40 to-navy-900/30 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-teal/40' : i % 3 === 1 ? 'bg-blue-400/30' : 'bg-soft-white/20'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionReveal>
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-teal via-soft-white to-blue-400 bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              Let's Connect
            </motion.h2>
            <motion.div 
              className="h-1 bg-gradient-to-r from-transparent via-teal to-transparent w-48 mx-auto mb-6"
              variants={itemVariants}
            ></motion.div>
            <motion.p 
              className="text-2xl text-muted-silver max-w-2xl mx-auto font-light leading-relaxed"
              variants={itemVariants}
            >
              Ready to bring your ideas to life? Let's discuss how we can create something amazing together.
            </motion.p>
          </motion.div>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <SectionReveal delay={0.2}>
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="bg-charcoal/20 backdrop-blur-sm rounded-3xl p-8 border border-teal/10 hover:border-teal/30 transition-all duration-500 group"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-6">
                  Get In Touch
                </h3>
                <p className="text-xl text-muted-silver leading-relaxed mb-8 font-light">
                  I'm always interested in new opportunities, collaborations, and innovative projects. 
                  Whether you have a question or just want to say hi, I'll get back to you as soon as possible!
                </p>

                {/* Social Links */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-soft-white">Connect with me</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-4 p-4 rounded-2xl bg-charcoal/30 border border-teal/10 text-soft-white transition-all duration-300 ${social.color} hover:scale-105 hover:shadow-lg group`}
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ 
                          y: -4,
                          scale: 1.05
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-teal to-blue-500 rounded-xl flex items-center justify-center text-charcoal group-hover:scale-110 transition-transform duration-300">
                          {getIconComponent(social.icon)}
                        </div>
                        <span className="font-medium text-lg">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-2 gap-6"
                variants={itemVariants}
              >
                <motion.div 
                  className="text-center p-6 bg-charcoal/20 rounded-2xl backdrop-blur-sm border border-teal/10 group hover:border-teal/30 transition-all duration-500"
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-3xl font-bold text-teal mb-2 group-hover:scale-110 transition-transform duration-300">
                    24h
                  </div>
                  <div className="text-muted-silver text-sm font-medium">Avg. Response Time</div>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-charcoal/20 rounded-2xl backdrop-blur-sm border border-teal/10 group hover:border-teal/30 transition-all duration-500"
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    100%
                  </div>
                  <div className="text-muted-silver text-sm font-medium">Project Success</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </SectionReveal>

          {/* Contact Form */}
          <SectionReveal delay={0.4}>
            <motion.div
              className="bg-charcoal/20 backdrop-blur-sm rounded-3xl p-8 border border-teal/10 hover:border-teal/30 transition-all duration-500"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    variants={itemVariants}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label htmlFor="name" className="block text-soft-white font-medium mb-3 text-lg">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-charcoal/30 border border-teal/20 rounded-2xl text-soft-white placeholder-muted-silver focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label htmlFor="email" className="block text-soft-white font-medium mb-3 text-lg">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-charcoal/30 border border-teal/20 rounded-2xl text-soft-white placeholder-muted-silver focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-300 backdrop-blur-sm"
                      placeholder="your.email@example.com"
                    />
                  </motion.div>
                </div>

                <motion.div
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                >
                  <label htmlFor="subject" className="block text-soft-white font-medium mb-3 text-lg">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-charcoal/30 border border-teal/20 rounded-2xl text-soft-white placeholder-muted-silver focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-300 backdrop-blur-sm"
                    placeholder="What's this about?"
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                >
                  <label htmlFor="message" className="block text-soft-white font-medium mb-3 text-lg">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-6 py-4 bg-charcoal/30 border border-teal/20 rounded-2xl text-soft-white placeholder-muted-silver focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-300 resize-none backdrop-blur-sm"
                    placeholder="Tell me about your project, idea, or just say hello..."
                  ></textarea>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-teal/20 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center justify-center space-x-3"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-6 h-6 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span>🚀</span>
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export default Contact