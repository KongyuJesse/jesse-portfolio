import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SectionReveal from './UI/SectionReveal'
import { useContentManagement } from '../hooks/useContentManagement'

const Skills = () => {
  const { skills, loading } = useContentManagement()
  const [activeCategory, setActiveCategory] = useState('frontend')

  const categories = {
    frontend: { name: 'Frontend Technologies', icon: '🎨', color: 'from-teal to-blue-400' },
    backend: { name: 'Backend Technologies', icon: '⚙️', color: 'from-blue-400 to-purple-500' },
    design: { name: 'Design Tools', icon: '🎯', color: 'from-purple-500 to-pink-500' },
    soft: { name: 'Professional Skills', icon: '🌟', color: 'from-pink-500 to-red-400' }
  }

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30, rotateX: 15 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      y: -12,
      scale: 1.08,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level) => ({
      width: `${level}%`,
      transition: {
        duration: 1.8,
        ease: "easeOut",
        delay: 0.5
      }
    })
  }

  if (loading) {
    return (
      <section id="skills" className="py-24 px-6 bg-gradient-to-br from-navy-900 to-charcoal relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-6">
                Skills & Expertise
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-teal to-blue-400 mx-auto mb-6"></div>
              <p className="text-2xl text-muted-silver max-w-2xl mx-auto font-light">
                Technologies and tools I work with
              </p>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-charcoal/30 rounded-2xl p-6 animate-pulse backdrop-blur-sm border border-teal/10">
                <div className="w-16 h-16 bg-muted-silver/10 rounded-2xl mb-4"></div>
                <div className="h-6 bg-muted-silver/10 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted-silver/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (skills.length === 0) {
    return null
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <section id="skills" className="py-24 px-6 bg-gradient-to-br from-navy-900 to-charcoal relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -25, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Animated grid */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #64FFDA 1px, transparent 1px),
              linear-gradient(to bottom, #64FFDA 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Skills & Expertise
            </motion.h2>
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-teal to-blue-400 mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.div>
            <motion.p 
              className="text-2xl text-muted-silver max-w-2xl mx-auto font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              A comprehensive overview of my technical arsenal and professional capabilities
            </motion.p>
          </div>
        </SectionReveal>

        {/* Category Tabs */}
        <SectionReveal delay={0.2}>
          <motion.div 
            className="flex flex-wrap gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {Object.entries(categories).map(([categoryKey, category]) => {
              const categorySkills = skillsByCategory[categoryKey]
              if (!categorySkills || categorySkills.length === 0) return null

              return (
                <motion.button
                  key={categoryKey}
                  onClick={() => setActiveCategory(categoryKey)}
                  className={`px-8 py-4 rounded-2xl capitalize transition-all duration-500 flex items-center space-x-4 backdrop-blur-sm border-2 ${
                    activeCategory === categoryKey
                      ? `bg-gradient-to-r ${category.color} text-navy-900 font-bold border-transparent shadow-2xl shadow-teal/30 scale-105`
                      : 'bg-charcoal/30 text-soft-white hover:bg-gradient-to-r hover:from-teal hover:to-blue-500 hover:text-navy-900 border-teal/20 hover:border-transparent hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="text-xl"
                    animate={activeCategory === categoryKey ? { rotate: 360 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.span>
                  <span className="text-lg font-semibold">{category.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    activeCategory === categoryKey ? 'bg-navy-900/30' : 'bg-teal/20'
                  }`}>
                    {categorySkills.length}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        </SectionReveal>

        {/* Skills Grid */}
        {Object.entries(categories).map(([categoryKey, category]) => {
          const categorySkills = skillsByCategory[categoryKey]
          if (!categorySkills || categorySkills.length === 0 || activeCategory !== categoryKey) return null

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categorySkills.map((skill, index) => (
                <motion.div
                  key={skill._id || index}
                  custom={index}
                  variants={skillVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-charcoal/30 rounded-2xl p-6 backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 group cursor-pointer relative overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Skill Header */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {skill.logo ? (
                        <img 
                          src={skill.logo} 
                          alt={skill.name}
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-teal/20 to-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl text-teal">⚡</span>
                        </div>
                      )}
                      
                      {/* Hover Glow */}
                      <motion.div
                        className="absolute inset-0 bg-teal/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </motion.div>

                    {/* Proficiency Level */}
                    <motion.div 
                      className="text-3xl font-bold text-teal"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {skill.level}%
                    </motion.div>
                  </div>

                  {/* Skill Info */}
                  <div className="relative z-10">
                    <h4 className="font-bold text-soft-white mb-4 text-xl group-hover:text-teal transition-colors duration-300">
                      {skill.name}
                    </h4>
                    
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-navy-900/50 rounded-full h-3 mb-3 overflow-hidden backdrop-blur-sm border border-teal/10">
                      <motion.div
                        custom={skill.level}
                        variants={progressVariants}
                        className={`bg-gradient-to-r ${category.color} h-3 rounded-full relative`}
                      >
                        {/* Progress Shine */}
                        <motion.div
                          className="absolute top-0 right-0 bottom-0 w-12 bg-white/40 transform -skew-x-12"
                          animate={{ x: [-20, 200] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-silver font-light">Proficiency</span>
                      <motion.span 
                        className="text-teal font-semibold"
                        whileHover={{ scale: 1.1 }}
                      >
                        {skill.level}% Mastered
                      </motion.span>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  {skill.experience && (
                    <motion.div 
                      className="mt-4 pt-4 border-t border-teal/10 flex items-center justify-between relative z-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="text-muted-silver text-sm font-light">Experience</span>
                      <span className="text-teal text-sm font-semibold">{skill.experience}</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )
        })}

        {/* Skills Summary */}
        <motion.div 
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { icon: '🚀', title: 'Fast Learning', desc: 'Quick to adapt to new technologies and frameworks' },
            { icon: '💡', title: 'Problem Solving', desc: 'Creative solutions for complex challenges' },
            { icon: '🔧', title: 'Best Practices', desc: 'Clean, maintainable, and scalable code' }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="text-center p-8 bg-charcoal/30 rounded-2xl backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 relative overflow-hidden"
              whileHover={{ y: -8, scale: 1.03 }}
              initial={{ opacity: 0, y: 20, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"
              />
              
              <motion.div 
                className="text-5xl mb-6 relative z-10"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.div>
              <h4 className="text-2xl font-bold text-soft-white mb-4 relative z-10">{item.title}</h4>
              <p className="text-muted-silver leading-relaxed text-lg font-light relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills