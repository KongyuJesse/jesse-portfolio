import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';

const ProjectForm = ({ project, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    image: '',
    technologies: [],
    category: 'frontend',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'in-progress'
  });
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        shortDescription: project.shortDescription || '',
        image: project.image || '',
        technologies: project.technologies || [],
        category: project.category || 'frontend',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured || false,
        status: project.status || 'in-progress'
      });
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.githubUrl) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'GitHub URL is required'
        });
        return;
      }

      if (project) {
        await api.updateProject(project._id, formData);
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Project updated successfully'
        });
      } else {
        await api.createProject(formData);
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Project created successfully'
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save project'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select an image file'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Image must be less than 5MB'
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadImage(formData);
      
      setFormData(prev => ({ ...prev, image: response.url }));
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload image'
      });
    } finally {
      setUploading(false);
    }
  };

  const addTechnology = () => {
    const tech = techInput.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tech]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-soft-white mb-2 font-medium">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            required
          />
        </div>

        <div>
          <label className="block text-soft-white mb-2 font-medium">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full Stack</option>
            <option value="mobile">Mobile</option>
            <option value="design">Design</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Short Description *
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
          placeholder="Brief description for project cards"
          required
        />
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Full Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal resize-none"
          placeholder="Detailed project description..."
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-soft-white mb-2 font-medium">
            GitHub URL *
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            placeholder="https://github.com/username/repo"
            required
          />
        </div>

        <div>
          <label className="block text-soft-white mb-2">
            Live URL (Optional)
          </label>
          <input
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            placeholder="https://your-project.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Project Image *
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="px-4 py-2 bg-teal text-navy-900 rounded-lg cursor-pointer hover:bg-teal/90 transition-colors font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
          {formData.image && (
            <div className="flex items-center space-x-2">
              <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
              <span className="text-muted-silver text-sm">Image selected</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Technologies
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-teal text-navy-900 rounded-full text-sm flex items-center font-medium"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTechnology(tech)}
                className="ml-2 text-navy-900 hover:text-red-500 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add technology and press Enter..."
            className="flex-1 px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
          />
          <button
            type="button"
            onClick={addTechnology}
            className="px-4 py-2 bg-charcoal text-soft-white rounded-lg hover:bg-teal hover:text-navy-900 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded text-teal focus:ring-teal"
          />
          <span className="text-soft-white font-medium">Featured Project</span>
        </label>

        <div>
          <label className="block text-soft-white mb-2 font-medium">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4 pt-4 border-t border-muted-silver/20">
        <Button
          type="submit"
          disabled={loading || uploading}
          className="flex-1"
        >
          {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;