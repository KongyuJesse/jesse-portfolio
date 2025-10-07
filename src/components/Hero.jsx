// Hero.jsx - Updated with enhanced profile picture design
import React from 'react';
import { motion } from 'framer-motion';
import TypingEffect from './UI/TypingEffect';
import Button from './UI/Button';
import { useContentManagement } from '../hooks/useContentManagement';
import { SOCIAL_LINKS } from '../utils/constants';

const Hero = () => {
  const { aboutContent } = useContentManagement();
  
  // Get experience from aboutContent stats
  const experienceStat = aboutContent?.stats?.find(stat => 
    stat.label?.toLowerCase().includes('year') || stat.label?.toLowerCase().includes('experience')
  );
  const experienceYears = experienceStat?.value || '5+';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: 90 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 1.8
      }
    }
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5 + i * 0.15,
        duration: 0.8,
        type: "spring",
        stiffness: 200
      }
    })
  };

  const floatingElementVariants = {
    float: (delay) => ({
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }
    })
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-navy-900 via-charcoal to-navy-800">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-teal/20 to-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
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
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
            x: [0, -40, 0],
            y: [0, 25, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Animated Grid Background */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #64FFDA 1px, transparent 1px),
              linear-gradient(to bottom, #64FFDA 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 bg-teal/30 rounded-full ${i % 3 === 0 ? 'bg-blue-400/30' : i % 3 === 1 ? 'bg-teal/40' : 'bg-soft-white/20'}`}
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

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-10">
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Welcome Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-teal/10 backdrop-blur-sm border border-teal/20 rounded-full px-4 py-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-teal rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-teal text-sm font-medium">Available for new projects</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                className="text-6xl lg:text-8xl font-bold text-soft-white leading-none"
                variants={itemVariants}
              >
                Kongyu{' '}
                <motion.span 
                  className="text-transparent bg-gradient-to-r from-teal via-blue-400 to-teal bg-clip-text block"
                  variants={itemVariants}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                >
                  Jesse Ntani
                </motion.span>
              </motion.h1>
              
              {/* Typing Effect Container */}
              <motion.div 
                className="text-3xl lg:text-4xl min-h-[3rem] flex items-center"
                variants={itemVariants}
              >
                <div className="text-muted-silver font-light">
                  <span className="text-teal/80 mr-2">▸</span>
                  <TypingEffect 
                    texts={[
                      "Full Stack Developer",
                      "AI Prompt Engineer", 
                      "UI Designer",
                      "Graphic Designer"
                    ]} 
                    speed={70}
                    delay={2500}
                  />
                </div>
              </motion.div>
              
              {/* Description */}
              <motion.p 
                className="text-xl text-muted-silver leading-relaxed max-w-2xl font-light tracking-wide"
                variants={itemVariants}
              >
                Crafting <span className="text-teal font-semibold">digital excellence</span> through 
                innovative, scalable solutions that transform visionary ideas into 
                <span className="text-blue-400 font-semibold"> production-ready applications</span>.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-6"
              variants={itemVariants}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                  size="large"
                  className="bg-gradient-to-r from-teal to-blue-500 hover:from-teal/90 hover:to-blue-500/90 shadow-lg shadow-teal/20"
                >
                  <span className="flex items-center gap-2">
                    Explore My Work
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  size="large"
                  className="border-teal/30 hover:border-teal/50 backdrop-blur-sm"
                >
                  Start Conversation
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div 
              className="flex items-center space-x-8 pt-8 border-t border-teal/10"
              variants={itemVariants}
            >
              <motion.span 
                className="text-soft-white font-light text-lg"
                variants={itemVariants}
              >
                Connect with me:
              </motion.span>
              
              <div className="flex items-center space-x-3">
                {[
                  { 
                    name: 'GitHub', 
                    url: SOCIAL_LINKS.github,
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                    color: 'hover:bg-gray-700'
                  },
                  { 
                    name: 'LinkedIn', 
                    url: SOCIAL_LINKS.linkedin,
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                    color: 'hover:bg-blue-600'
                  },
                  { 
                    name: 'Twitter', 
                    url: SOCIAL_LINKS.twitter,
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    ),
                    color: 'hover:bg-sky-500'
                  },
                  { 
                    name: 'Email', 
                    url: SOCIAL_LINKS.email,
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    ),
                    color: 'hover:bg-red-500'
                  }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-charcoal/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-teal/10 transition-all duration-500 group relative ${social.color}`}
                    variants={socialVariants}
                    custom={index}
                    whileHover={{ 
                      scale: 1.15,
                      y: -5,
                      rotate: 360
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className="text-muted-silver group-hover:text-soft-white transition-colors duration-300"
                      whileHover={{ scale: 1.2 }}
                    >
                      {social.icon}
                    </motion.div>
                    
                    {/* Enhanced Tooltip */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-charcoal/90 backdrop-blur-sm text-soft-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-teal/20 shadow-lg">
                      {social.name}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-charcoal/90 rotate-45 border-l border-t border-teal/20"></div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Enhanced Profile Picture with Premium Design */}
          <motion.div 
            className="flex justify-center lg:justify-end relative"
            variants={imageVariants}
          >
            <div className="relative group">
              {/* Main Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-teal/30 via-blue-500/20 to-purple-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Outer Ring Animation */}
              <motion.div
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-teal via-blue-500 to-purple-500 opacity-20 blur-md"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Profile Image Container */}
              <motion.div
                className="relative w-96 h-96 rounded-full overflow-hidden bg-gradient-to-br from-charcoal to-navy-800 shadow-2xl border-8 border-charcoal/80 backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.02,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Animated Border Gradient */}
                <motion.div
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-teal via-blue-500 to-purple-500 opacity-70"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '4px'
                  }}
                />
                
                {/* Profile Image */}
                {aboutContent?.image ? (
                  <motion.img
                    src={aboutContent.image}
                    alt="Kongyu Jesse Ntani"
                    className="w-full h-full object-cover rounded-full relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-silver bg-gradient-to-br from-charcoal to-navy-800 rounded-full relative z-10">
                    <span className="text-8xl opacity-50">👨‍💻</span>
                  </div>
                )}
                
                {/* Inner Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-teal/10 to-blue-500/5 pointer-events-none"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Floating Tech Badges */}
              {[
                { tech: "React", emoji: "⚛", position: "-top-6 -left-6", delay: 0 },
                { tech: "AI/ML", emoji: "🤖", position: "-top-6 -right-6", delay: 0.5 },
                { tech: "Cloud", emoji: "☁", position: "-bottom-6 -left-6", delay: 1 },
                { tech: "Node", emoji: "🟢", position: "-bottom-6 -right-6", delay: 1.5 }
              ].map((badge, index) => (
                <motion.div
                  key={badge.tech}
                  className={`absolute ${badge.position} bg-charcoal/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-teal/30 shadow-xl z-20`}
                  custom={badge.delay}
                  variants={floatingElementVariants}
                  animate="float"
                  whileHover={{ scale: 1.1, y: -5, rotate: 5 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="text-teal text-lg"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {badge.emoji}
                    </motion.span>
                    <span className="text-soft-white text-sm font-semibold">{badge.tech}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Experience Badge */}
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal to-blue-500 text-charcoal px-6 py-3 rounded-full font-bold text-sm shadow-lg z-30"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              🏆 {experienceYears} Years Experience
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-teal/70 text-sm font-light tracking-widest uppercase">
              Scroll to explore
            </span>
            <motion.div
              className="w-6 h-10 border-2 border-teal/50 rounded-full flex justify-center backdrop-blur-sm"
              animate={{
                borderColor: ['rgba(100, 255, 218, 0.5)', 'rgba(100, 255, 218, 0.8)', 'rgba(100, 255, 218, 0.5)']
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <motion.div
                className="w-1 h-3 bg-teal rounded-full mt-2"
                animate={{
                  y: [0, 12, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;