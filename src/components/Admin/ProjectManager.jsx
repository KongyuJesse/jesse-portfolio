// src/components/Admin/ProjectManager.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectForm from './ProjectForm';
import  api  from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load projects'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(projectId);
        setProjects(projects.filter(p => p._id !== projectId));
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Project deleted successfully'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete project'
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-teal text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal">Projects Management</h2>
          <p className="text-muted-silver">Create, edit, and manage your portfolio projects</p>
        </div>
        <Button onClick={handleCreate}>
          + Add New Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-charcoal/50 rounded-lg p-6 border border-muted-silver/20 hover:border-teal/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-soft-white">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {project.status === 'completed' ? 'Completed' : 'Under Development'}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 bg-teal/20 text-teal rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-muted-silver mb-3">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies?.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-navy-900 text-teal text-sm rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-silver">
                  <span className="capitalize">{project.category}</span>
                  <span>•</span>
                  <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleDelete(project._id)}
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-soft-white mb-2">No Projects Yet</h3>
            <p className="text-muted-silver mb-6">Start by creating your first project</p>
            <Button onClick={handleCreate}>
              Create Your First Project
            </Button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={handleFormCancel}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
};

export default ProjectManager;