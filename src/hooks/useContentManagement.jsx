import { useState, useEffect, createContext, useContext } from 'react'
import {
  getProjects,
  getSkills,
  getCertificates,
  getAboutContent,
  getResume,
  updateSkills as updateSkillsApi
} from '../utils/api'

const ContentContext = createContext()

export const useContentManagement = () => {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContentManagement must be used within a ContentProvider')
  }
  return context
}

export const ContentProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [certificates, setCertificates] = useState([])
  const [aboutContent, setAboutContent] = useState({})
  const [activeResume, setActiveResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [projectsData, skillsData, certificatesData, aboutData, resumeData] = await Promise.all([
        getProjects(),
        getSkills(),
        getCertificates(),
        getAboutContent(),
        getResume().catch(err => { // Handle case where no resume exists
          console.log('No active resume found');
          return null;
        })
      ])
      
      setProjects(projectsData || [])
      setSkills(skillsData || [])
      setCertificates(certificatesData || [])
      setAboutContent(aboutData || {})
      setActiveResume(resumeData || null)
    } catch (err) {
      console.error('Error loading content:', err)
      setError('Failed to load content. Please try again later.')
      
      // Set fallback data
      setProjects([])
      setSkills([])
      setCertificates([])
      setAboutContent({})
      setActiveResume(null)
    } finally {
      setLoading(false)
    }
  }

  const updateSkills = async (newSkills) => {
    try {
      setError(null)
      const updatedSkills = await updateSkillsApi(newSkills)
      setSkills(updatedSkills)
      return updatedSkills
    } catch (err) {
      console.error('Error updating skills:', err)
      setError('Failed to update skills')
      throw err
    }
  }

  const addProject = (project) => {
    setProjects(prev => [...prev, project])
  }

  const updateProject = (id, updatedProject) => {
    setProjects(prev => prev.map(p => p._id === id ? { ...p, ...updatedProject } : p))
  }

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p._id !== id))
  }

  const addCertificate = (certificate) => {
    setCertificates(prev => [...prev, certificate])
  }

  const deleteCertificate = (id) => {
    setCertificates(prev => prev.filter(c => c._id !== id))
  }

  const value = {
    // Data
    projects,
    skills,
    certificates,
    aboutContent,
    activeResume,
    loading,
    error,
    
    // Actions
    loadContent,
    updateSkills,
    addProject,
    updateProject,
    deleteProject,
    addCertificate,
    deleteCertificate,
    setProjects,
    setSkills,
    setCertificates,
    setAboutContent,
    setActiveResume
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}

export default ContentProvider