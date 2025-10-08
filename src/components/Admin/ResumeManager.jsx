import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import  api  from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newResume, setNewResume] = useState({
    title: '',
    version: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await api.getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load resumes'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select a PDF file'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Resume must be less than 10MB'
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      addNotification({
        type: 'error',
        title: 'No File Selected',
        message: 'Please select a PDF file to upload'
      });
      return;
    }

    if (!newResume.title || !newResume.version) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Title and version are required'
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('title', newResume.title);
      formData.append('version', newResume.version);
      formData.append('description', newResume.description);

      // Use the uploadDocument API function for file upload
      const uploadResponse = await api.uploadDocument(formData);
      
      // Now create the resume record with the uploaded file URL
      const resumeData = {
        title: newResume.title,
        fileName: selectedFile.name,
        fileUrl: uploadResponse.url,
        fileSize: selectedFile.size,
        version: newResume.version,
        description: newResume.description,
        isActive: false
      };

      await api.uploadResume(resumeData);
      
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Resume uploaded successfully'
      });
      
      // Reset form and refresh list
      setShowUploadForm(false);
      setNewResume({ title: '', version: '', description: '' });
      setSelectedFile(null);
      fetchResumes();
    } catch (error) {
      console.error('Upload error:', error);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error.response?.data?.message || 'Failed to upload resume'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (resumeId) => {
    try {
      await api.activateResume(resumeId);
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Resume activated successfully'
      });
      fetchResumes();
    } catch (error) {
      console.error('Activation error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to activate resume'
      });
    }
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await api.deleteResume(resumeId);
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Resume deleted successfully'
        });
        fetchResumes();
      } catch (error) {
        console.error('Delete error:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.response?.data?.message || 'Failed to delete resume'
        });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-teal text-xl">Loading resumes...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal">Resume Management</h2>
          <p className="text-muted-silver">Manage your professional resume documents</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)}>
          + Upload New Resume
        </Button>
      </div>

      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal/50 rounded-lg p-6 mb-6 border border-teal/20"
        >
          <h3 className="text-lg font-semibold text-soft-white mb-4">Upload New Resume</h3>
          <form onSubmit={handleUploadResume} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-soft-white mb-2">Title *</label>
                <input
                  type="text"
                  value={newResume.title}
                  onChange={(e) => setNewResume({...newResume, title: e.target.value})}
                  className="w-full px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded text-soft-white focus:outline-none focus:border-teal"
                  placeholder="e.g., Professional Resume 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-soft-white mb-2">Version *</label>
                <input
                  type="text"
                  value={newResume.version}
                  onChange={(e) => setNewResume({...newResume, version: e.target.value})}
                  className="w-full px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded text-soft-white focus:outline-none focus:border-teal"
                  placeholder="e.g., 2.1, 2024.1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-soft-white mb-2">Description</label>
              <input
                type="text"
                value={newResume.description}
                onChange={(e) => setNewResume({...newResume, description: e.target.value})}
                className="w-full px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded text-soft-white focus:outline-none focus:border-teal"
                placeholder="Brief description of this resume version"
              />
            </div>
            <div>
              <label className="block text-soft-white mb-2">PDF File *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="w-full px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded text-soft-white focus:outline-none focus:border-teal"
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-teal text-sm mt-1">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
              <p className="text-muted-silver text-sm mt-1">
                Maximum file size: 10MB. Only PDF files accepted.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={uploading || !selectedFile || !newResume.title || !newResume.version}
              >
                {uploading ? 'Uploading...' : 'Upload Resume'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                  setNewResume({ title: '', version: '', description: '' });
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {resumes.map((resume, index) => (
          <motion.div
            key={resume._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-charcoal/50 rounded-lg p-6 border border-muted-silver/20 hover:border-teal/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-soft-white">
                    {resume.title}
                  </h3>
                  {resume.isActive && (
                    <span className="px-2 py-1 bg-teal text-navy-900 text-sm rounded-full font-medium">
                      Active
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-silver mb-3">
                  <div>
                    <strong>File:</strong> {resume.fileName}
                  </div>
                  <div>
                    <strong>Size:</strong> {formatFileSize(resume.fileSize)}
                  </div>
                  <div>
                    <strong>Version:</strong> v{resume.version}
                  </div>
                </div>
                {resume.description && (
                  <p className="text-muted-silver text-sm mb-2">{resume.description}</p>
                )}
                <p className="text-muted-silver text-sm">
                  Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {!resume.isActive && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleActivate(resume._id)}
                  >
                    Activate
                  </Button>
                )}
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  View
                </a>
                {!resume.isActive && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDelete(resume._id)}
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {resumes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-soft-white mb-2">No Resumes Uploaded</h3>
            <p className="text-muted-silver mb-6">Upload your first resume to get started</p>
            <Button onClick={() => setShowUploadForm(true)}>
              Upload Your First Resume
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeManager;