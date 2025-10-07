import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from './UI/SectionReveal'
import { useContentManagement } from '../hooks/useContentManagement'

const Projects = () => {
  const { projects, loading } = useContentManagement()
  const [filter, setFilter] = useState('all')
  const [hoveredProject, setHoveredProject] = useState(null)

  const categories = [
    { key: 'all', name: 'All Projects', icon: '🌟' },
    { key: 'frontend', name: 'Frontend', icon: '🎨' },
    { key: 'backend', name: 'Backend', icon: '⚙️' },
    { key: 'fullstack', name: 'Full Stack', icon: '🚀' },
    { key: 'mobile', name: 'Mobile', icon: '📱' },
    { key: 'design', name: 'Design', icon: '🎯' }
  ]

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      y: -15,
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <section id="projects" className="py-24 px-6 bg-gradient-to-br from-charcoal/40 to-navy-900/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-6">
                Portfolio Projects
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-teal to-blue-400 mx-auto mb-6"></div>
              <p className="text-2xl text-muted-silver max-w-2xl mx-auto font-light">
                Showcasing my latest work and innovations
              </p>
            </div>
          </SectionReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-charcoal/30 rounded-2xl overflow-hidden animate-pulse backdrop-blur-sm border border-teal/10">
                <div className="w-full h-48 bg-muted-silver/10"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted-silver/10 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted-silver/10 rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted-silver/10 rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted-silver/10 rounded w-20"></div>
                    <div className="h-8 bg-muted-silver/10 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="py-24 px-6 bg-gradient-to-br from-charcoal/40 to-navy-900/30 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-teal/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 40, 0],
            y: [0, -25, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-teal/30' : i % 3 === 1 ? 'bg-blue-400/20' : 'bg-purple-400/15'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
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
              Portfolio Projects
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
              A collection of my recent work showcasing innovative solutions and cutting-edge technologies
            </motion.p>
          </div>
        </SectionReveal>

        {/* Enhanced Filter Buttons */}
        {projects.length > 3 && (
          <SectionReveal delay={0.2}>
            <motion.div 
              className="flex flex-wrap gap-4 mb-16 justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.key}
                  onClick={() => setFilter(category.key)}
                  className={`px-8 py-4 rounded-2xl capitalize transition-all duration-500 flex items-center space-x-3 backdrop-blur-sm border-2 ${
                    filter === category.key
                      ? 'bg-gradient-to-r from-teal to-blue-500 text-navy-900 font-bold border-transparent shadow-2xl shadow-teal/30 scale-105'
                      : 'bg-charcoal/30 text-soft-white hover:bg-gradient-to-r hover:from-teal hover:to-blue-500 hover:text-navy-900 border-teal/20 hover:border-transparent hover:scale-105'
                  }`}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    animate={filter === category.key ? { rotate: 360 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.span>
                  <span className="text-lg">{category.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </SectionReveal>
        )}

        {/* Enhanced Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                custom={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredProject(project._id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group cursor-pointer"
              >
                <div className="bg-charcoal/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 h-full flex flex-col relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative overflow-hidden">
                    {project.image ? (
                      <motion.img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-navy-900 to-charcoal flex items-center justify-center">
                        <motion.span 
                          className="text-6xl text-teal/50"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          📁
                        </motion.span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-between p-6"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex space-x-3">
                        {project.liveUrl && (
                          <motion.a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-teal text-navy-900 rounded-lg font-semibold hover:bg-teal/90 transition-colors text-sm flex items-center space-x-2 shadow-lg"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>🌐</span>
                            <span>Live Demo</span>
                          </motion.a>
                        )}
                        {project.githubUrl && (
                          <motion.a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-teal text-teal rounded-lg font-semibold hover:bg-teal hover:text-navy-900 transition-colors text-sm flex items-center space-x-2 backdrop-blur-sm"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>💻</span>
                            <span>GitHub</span>
                          </motion.a>
                        )}
                      </div>
                    </motion.div>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                      animate={{ x: hoveredProject === project._id ? [0, 400] : 0 }}
                      transition={{ duration: 1, repeat: hoveredProject === project._id ? Infinity : 0 }}
                    />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative z-10">
                    <motion.h3 
                      className="text-2xl font-semibold mb-3 text-soft-white group-hover:text-teal transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {project.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-muted-silver mb-4 leading-relaxed flex-1 font-light text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {project.shortDescription || project.description}
                    </motion.p>

                    {project.technologies && project.technologies.length > 0 && (
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {project.technologies.map((tech, techIndex) => (
                          <motion.span 
                            key={tech}
                            className="px-3 py-2 bg-gradient-to-r from-teal/20 to-blue-500/20 text-teal text-sm rounded-xl border border-teal/30 backdrop-blur-sm font-medium"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + techIndex * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    <motion.div 
                      className="flex items-center justify-between mt-auto pt-4 border-t border-teal/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-muted-silver text-sm flex items-center space-x-2 font-light">
                        <motion.span 
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.span>
                        <span>Completed</span>
                      </span>
                      {project.category && (
                        <span className="text-teal text-sm font-semibold capitalize">
                          {project.category}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-8xl mb-6"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🔍
            </motion.div>
            <h3 className="text-3xl font-semibold text-soft-white mb-4">
              No projects found
            </h3>
            <p className="text-muted-silver text-xl font-light">
              Try selecting a different category or check back later for new projects.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Projects