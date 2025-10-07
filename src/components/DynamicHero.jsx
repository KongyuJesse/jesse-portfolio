import React from 'react';
import { motion } from 'framer-motion';
import TypingEffect from './UI/TypingEffect';
import Button from './UI/Button';
import { useContentManagement } from '../hooks/useContentManagement';

const DynamicHero = () => {
  const { aboutContent } = useContentManagement();

  const handleDownloadResume = () => {
    window.open('/api/resume/download', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-navy-900 via-charcoal to-navy-800">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        {/* Animated Grid */}
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
      {[...Array(20)].map((_, i) => (
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

      <div className="max-w-7xl mx-auto text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-teal/10 backdrop-blur-sm border border-teal/20 rounded-full px-6 py-3"
            variants={itemVariants}
          >
            <motion.div 
              className="w-3 h-3 bg-teal rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-teal font-medium">Welcome to my portfolio</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-soft-white leading-none"
            variants={itemVariants}
          >
            {aboutContent.hero?.title || "Kongyu"}{' '}
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
              {aboutContent.hero?.subtitle || "Jesse Ntani"}
            </motion.span>
          </motion.h1>
          
          {/* Typing Effect */}
          <motion.div 
            className="text-3xl md:text-4xl lg:text-5xl min-h-[4rem] flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="text-muted-silver font-light">
              <span className="text-teal/80 mr-4">▸</span>
              <TypingEffect 
                texts={aboutContent.hero?.typingTexts || [
                  "Full Stack Architect",
                  "AI Solutions Engineer", 
                  "Digital Innovator",
                  "Tech Visionary",
                  "Cloud Specialist"
                ]} 
                speed={70}
                delay={2500}
              />
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-xl md:text-2xl text-soft-white/80 max-w-4xl mx-auto leading-relaxed font-light"
            variants={itemVariants}
          >
            Crafting <span className="text-teal font-semibold">digital excellence</span> through 
            innovative, scalable solutions that transform visionary ideas into 
            <span className="text-blue-400 font-semibold"> production-ready applications</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            variants={itemVariants}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button 
                size="large"
                onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-teal to-blue-500 hover:from-teal/90 hover:to-blue-500/90 shadow-lg shadow-teal/20 px-8 py-4 text-lg"
              >
                <span className="flex items-center gap-3">
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
                size="large"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="border-teal/30 hover:border-teal/50 backdrop-blur-sm px-8 py-4 text-lg"
              >
                Start Conversation
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost"
                size="large"
                onClick={handleDownloadResume}
                className="flex items-center space-x-3 px-8 py-4 text-lg"
              >
                <motion.span
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📥
                </motion.span>
                <span>Download Resume</span>
              </Button>
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
            className="flex flex-col items-center gap-3"
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

export default DynamicHero;