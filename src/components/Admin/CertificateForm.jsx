import React, { useState, useEffect } from 'react';
import { createCertificate, updateCertificate, uploadImage } from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';

const CertificateForm = ({ certificate, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    image: '',
    description: '',
    skills: [],
    featured: false
  });
  const [skillInput, setSkillInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (certificate) {
      setFormData({
        name: certificate.name || '',
        issuer: certificate.issuer || '',
        issueDate: certificate.issueDate ? new Date(certificate.issueDate).toISOString().split('T')[0] : '',
        credentialUrl: certificate.credentialUrl || '',
        image: certificate.image || '',
        description: certificate.description || '',
        skills: certificate.skills || [],
        featured: certificate.featured || false
      });
    }
  }, [certificate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.issuer || !formData.issueDate || !formData.image || !formData.description) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fill all required fields: Name, Issuer, Issue Date, Image, and Description'
        });
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        issueDate: new Date(formData.issueDate)
      };

      if (certificate) {
        await updateCertificate(certificate._id, submitData);
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Certificate updated successfully'
        });
      } else {
        await createCertificate(submitData);
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Certificate created successfully'
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Certificate save error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save certificate. Please try again.'
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
        message: 'Please select an image file (JPEG, PNG, etc.)'
      });
      return;
    }

    // Check file size (5MB limit)
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
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await uploadImage(uploadFormData);
      
      setFormData(prev => ({ ...prev, image: response.url }));
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Certificate image uploaded successfully'
      });
    } catch (error) {
      console.error('Image upload error:', error);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error.response?.data?.message || 'Failed to upload image. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-soft-white mb-2 font-medium">
            Certificate Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            placeholder="e.g., Full Stack Web Development"
            required
          />
        </div>

        <div>
          <label className="block text-soft-white mb-2 font-medium">
            Issuing Organization *
          </label>
          <input
            type="text"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            placeholder="e.g., Meta, Google, Microsoft"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-soft-white mb-2 font-medium">
            Issue Date *
          </label>
          <input
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            required
          />
        </div>

        <div>
          <label className="block text-soft-white mb-2">
            Credential URL (Optional)
          </label>
          <input
            type="url"
            value={formData.credentialUrl}
            onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
            className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            placeholder="https://credentials.example.com/verify/123"
          />
        </div>
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Certificate Image *
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="certificate-image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="certificate-image-upload"
            className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-colors ${
              uploading 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                : 'bg-teal text-navy-900 hover:bg-teal/90'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Certificate Image'}
          </label>
          {formData.image && (
            <div className="flex items-center space-x-2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-16 h-12 object-cover rounded border border-teal/30" 
              />
              <span className="text-teal text-sm font-medium">✓ Image selected</span>
            </div>
          )}
        </div>
        <p className="text-muted-silver text-sm mt-2">
          Supported formats: JPEG, PNG, WebP. Max size: 5MB
        </p>
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal resize-none"
          placeholder="Describe what this certificate represents and the skills gained..."
          required
        />
      </div>

      <div>
        <label className="block text-soft-white mb-2 font-medium">
          Skills & Technologies
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-teal text-navy-900 rounded-full text-sm flex items-center font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 text-navy-900 hover:text-red-500 text-xs transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add skill and press Enter..."
            className="flex-1 px-4 py-2 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
            disabled={loading}
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-charcoal text-soft-white rounded-lg hover:bg-teal hover:text-navy-900 transition-colors font-medium disabled:opacity-50"
            disabled={loading || !skillInput.trim()}
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded text-teal focus:ring-teal"
            disabled={loading}
          />
          <span className="text-soft-white font-medium">Featured Certificate</span>
        </label>
        <p className="text-muted-silver text-sm mt-1">
          Featured certificates will be prominently displayed
        </p>
      </div>

      <div className="flex space-x-4 pt-4 border-t border-muted-silver/20">
        <Button
          type="submit"
          disabled={loading || uploading || !formData.name || !formData.issuer || !formData.issueDate || !formData.image || !formData.description}
          className="flex-1"
        >
          {loading ? 'Saving...' : (certificate ? 'Update Certificate' : 'Create Certificate')}
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

export default CertificateForm;