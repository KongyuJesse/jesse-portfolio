// Certificates.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from './UI/SectionReveal'
import Modal from './UI/Modal'
import { useContentManagement } from '../hooks/useContentManagement'

const Certificates = () => {
  const { certificates, loading } = useContentManagement()
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  const openCertificateModal = (certificate) => {
    setSelectedCertificate(certificate)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCertificate(null)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <section id="certificates" className="py-24 px-6 bg-gradient-to-br from-navy-900 to-charcoal relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-4">
                Certifications
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-teal to-blue-400 mx-auto mb-4"></div>
              <p className="text-xl text-muted-silver max-w-2xl mx-auto">
                Professional credentials and achievements
              </p>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-charcoal/30 rounded-2xl overflow-hidden animate-pulse backdrop-blur-sm border border-teal/10">
                <div className="w-full h-64 bg-muted-silver/10"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted-silver/10 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted-silver/10 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-muted-silver/10 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!certificates || certificates.length === 0) {
    return null
  }

  return (
    <section id="certificates" className="py-24 px-6 bg-gradient-to-br from-navy-900 to-charcoal relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Certifications
            </motion.h2>
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-teal to-blue-400 mx-auto mb-4"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.div>
            <motion.p 
              className="text-xl text-muted-silver max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Professional credentials and achievements that validate my expertise
            </motion.p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate._id || index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onHoverStart={() => setHoveredCard(certificate._id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group cursor-pointer"
                onClick={() => openCertificateModal(certificate)}
              >
                <div className="bg-charcoal/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-teal/10 hover:border-teal/30 transition-all duration-500 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    {certificate.image ? (
                      <motion.img 
                        src={certificate.image} 
                        alt={certificate.name}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-navy-900 to-charcoal flex items-center justify-center">
                        <motion.span 
                          className="text-6xl text-teal/50"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          📜
                        </motion.span>
                      </div>
                    )}
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-6"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span 
                        className="text-teal font-semibold text-lg bg-charcoal/80 backdrop-blur-sm px-4 py-2 rounded-full"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        View Details
                      </motion.span>
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform"
                      animate={{ x: hoveredCard === certificate._id ? [0, 400] : 0 }}
                      transition={{ duration: 1, repeat: hoveredCard === certificate._id ? Infinity : 0 }}
                    />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-3 text-soft-white group-hover:text-teal transition-colors duration-300">
                      {certificate.name}
                    </h3>
                    <p className="text-muted-silver mb-2 flex items-center">
                      <span className="w-2 h-2 bg-teal rounded-full mr-2"></span>
                      Issued by: {certificate.issuer}
                    </p>
                    <p className="text-muted-silver text-sm mt-auto flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Issued: {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedCertificate && (
            <motion.div 
              className="max-w-4xl mx-auto bg-gradient-to-br from-charcoal to-navy-900 rounded-3xl overflow-hidden backdrop-blur-sm border border-teal/20 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative">
                {selectedCertificate.image ? (
                  <img 
                    src={selectedCertificate.image} 
                    alt={selectedCertificate.name}
                    className="w-full h-96 object-contain bg-white"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-navy-900 to-charcoal flex items-center justify-center">
                    <span className="text-8xl text-teal/50">📜</span>
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <motion.h3 
                  className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedCertificate.name}
                </motion.h3>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-semibold text-soft-white mb-3 flex items-center">
                      <span className="w-3 h-3 bg-teal rounded-full mr-3"></span>
                      Issuer
                    </h4>
                    <p className="text-muted-silver text-lg">{selectedCertificate.issuer}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-semibold text-soft-white mb-3 flex items-center">
                      <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                      Issue Date
                    </h4>
                    <p className="text-muted-silver text-lg">
                      {selectedCertificate.issueDate ? new Date(selectedCertificate.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </motion.div>
                </div>

                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="font-semibold text-soft-white mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                    Description
                  </h4>
                  <p className="text-muted-silver leading-relaxed text-lg">
                    {selectedCertificate.description || 'No description available.'}
                  </p>
                </motion.div>

                {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="font-semibold text-soft-white mb-3 flex items-center">
                      <span className="w-3 h-3 bg-purple-400 rounded-full mr-3"></span>
                      Skills & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedCertificate.skills.map((skill, index) => (
                        <motion.span 
                          key={skill} 
                          className="px-4 py-2 bg-gradient-to-r from-teal/20 to-blue-500/20 text-teal rounded-full text-sm font-medium border border-teal/30 backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {selectedCertificate.credentialUrl && (
                    <motion.a 
                      href={selectedCertificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-xl hover:shadow-lg hover:shadow-teal/20 transition-all duration-300 flex items-center space-x-3"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>🔗</span>
                      <span>Verify Credential</span>
                    </motion.a>
                  )}
                  {selectedCertificate.image && (
                    <motion.button 
                      onClick={() => window.open(selectedCertificate.image, '_blank')}
                      className="px-8 py-4 border-2 border-teal text-teal font-semibold rounded-xl hover:bg-teal hover:text-navy-900 transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>👁️</span>
                      <span>View Full Image</span>
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </Modal>
      </div>
    </section>
  )
}

export default Certificates