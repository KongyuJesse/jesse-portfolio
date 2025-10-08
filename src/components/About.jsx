import React from 'react'
import { motion } from 'framer-motion'
import SectionReveal from './UI/SectionReveal'
import ResumeDownload from './ResumeDownload'
import { useContentManagement } from '../hooks/useContentManagement'

const About = () => {
  const { aboutContent, loading } = useContentManagement()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const statVariants = {
    hidden: { scale: 0, opacity: 0, rotateY: 90 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    })
  }

  const serviceVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  }

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.05,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <section id="about" className="min-h-screen py-24 px-6 bg-gradient-to-br from-charcoal/40 to-navy-900/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5" />
          <motion.div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #64FFDA 2px, transparent 0)`,
              backgroundSize: '60px 60px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '60px 60px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionReveal>
            <div className="text-center mb-16">
              <div className="h-8 bg-charcoal/50 rounded w-48 mx-auto mb-4 animate-pulse"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-teal to-transparent w-32 mx-auto"></div>
            </div>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="w-96 h-96 bg-charcoal/30 rounded-2xl animate-pulse shadow-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-6 bg-charcoal/30 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-charcoal/30 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-charcoal/30 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="min-h-screen py-24 px-6 bg-gradient-to-br from-charcoal/40 to-navy-900/30 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #64FFDA 2px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-teal/40' : i % 3 === 1 ? 'bg-blue-400/30' : 'bg-soft-white/20'}`}
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
              {aboutContent?.title || 'About Me'}
            </motion.h2>
            <motion.div 
              className="h-1 bg-gradient-to-r from-transparent via-teal to-transparent w-48 mx-auto"
              variants={itemVariants}
            ></motion.div>
            <motion.p 
              className="text-2xl text-muted-silver mt-6 max-w-2xl mx-auto font-light"
              variants={itemVariants}
            >
              Crafting digital excellence through innovative solutions
            </motion.p>
          </motion.div>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <SectionReveal delay={0.2}>
            <motion.div 
              className="relative flex justify-center"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className="relative group cursor-pointer">
                <div className="relative w-96 h-96">
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal via-blue-500 to-purple-500 p-1"
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-full h-full bg-navy-900 rounded-3xl backdrop-blur-sm">
                      {aboutContent?.image ? (
                        <motion.img 
                          src={aboutContent.image} 
                          alt="Profile"
                          className="w-full h-full object-cover rounded-3xl transform transition-all duration-700 group-hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-charcoal to-navy-900 rounded-3xl flex items-center justify-center">
                          <motion.span 
                            className="text-6xl text-muted-silver opacity-50"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            👤
                          </motion.span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  {['React', 'AI', 'Cloud'].map((tech, index) => (
                    <motion.div
                      key={tech}
                      className={`absolute ${index === 0 ? '-top-4 -left-4' : index === 1 ? '-top-4 -right-4' : '-bottom-4 left-1/4'} bg-charcoal/80 backdrop-blur-md px-4 py-2 rounded-full border border-teal/30 shadow-lg`}
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{
                        delay: 1 + index * 0.3,
                        duration: 0.6,
                        type: "spring"
                      }}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <span className="text-teal text-sm font-semibold">{tech}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="absolute inset-0 rounded-3xl bg-teal/20 blur-3xl -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="text-3xl leading-relaxed text-soft-white font-light"
                variants={itemVariants}
              >
                <span className="text-transparent bg-gradient-to-r from-teal to-blue-400 bg-clip-text font-semibold">Innovative technologist</span> passionate about building 
                scalable, AI-driven solutions that create meaningful impact in today's digital landscape.
              </motion.div>
              
              <motion.p 
                className="text-xl leading-relaxed text-muted-silver font-light"
                variants={itemVariants}
              >
                With expertise in modern web technologies and a keen eye for user experience, 
                I specialize in transforming complex challenges into elegant, production-ready solutions.
              </motion.p>

              {aboutContent?.stats && aboutContent.stats.length > 0 && (
                <motion.div 
                  className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-8"
                  variants={itemVariants}
                >
                  {aboutContent.stats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      custom={index}
                      variants={statVariants}
                      className="text-center p-6 bg-charcoal/30 rounded-2xl backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 group relative overflow-hidden"
                      whileHover={{ 
                        y: -8,
                        scale: 1.05,
                        backgroundColor: 'rgba(100, 255, 218, 0.05)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <div className="text-4xl font-bold text-teal mb-2 group-hover:scale-110 transition-transform duration-300">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-silver font-medium uppercase tracking-wide">
                          {stat.label}
                        </div>
                        <motion.div 
                          className="text-xl mt-3 text-teal/70"
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        >
                          {stat.icon}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div 
                className="pt-6"
                variants={itemVariants}
              >
                <ResumeDownload />
              </motion.div>
            </motion.div>
          </SectionReveal>
        </div>

        {aboutContent?.services && aboutContent.services.length > 0 && (
          <SectionReveal delay={0.6}>
            <motion.div 
              className="mt-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="text-center mb-16"
                variants={itemVariants}
              >
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-4">
                  Expertise & Services
                </h3>
                <p className="text-2xl text-muted-silver max-w-2xl mx-auto font-light">
                  Comprehensive solutions tailored to your digital needs
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aboutContent.services.map((service, index) => (
                  <motion.div 
                    key={index}
                    custom={index}
                    variants={serviceVariants}
                    className="bg-charcoal/20 rounded-2xl p-8 backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 group relative overflow-hidden"
                    whileHover={{ 
                      y: -12,
                      scale: 1.03
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <motion.div 
                      className="relative z-10 mb-6"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-teal to-blue-500 rounded-2xl flex items-center justify-center text-3xl text-charcoal shadow-lg shadow-teal/20">
                        {service.icon || '💼'}
                      </div>
                    </motion.div>
                    
                    <h4 className="text-2xl font-semibold text-soft-white mb-4 relative z-10">
                      {service.title}
                    </h4>
                    <p className="text-muted-silver leading-relaxed relative z-10 font-light text-lg">
                      {service.description}
                    </p>

                    <motion.div 
                      className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal to-blue-500 group-hover:w-full transition-all duration-500"
                      initial={false}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </SectionReveal>
        )}
      </div>
    </section>
  )
}

export default About