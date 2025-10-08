import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import  api  from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';

const AboutManager = () => {
  const [aboutData, setAboutData] = useState({
    title: '',
    description: '',
    bio: '',
    image: '',
    stats: [],
    services: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const data = await api.getAboutContent();
      setAboutData(data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load about content'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAboutContent(aboutData);
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'About content updated successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update about content'
      });
    } finally {
      setSaving(false);
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

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setAboutData(prev => ({ ...prev, image: data.url }));
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Profile image uploaded successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload profile image'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...aboutData.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    setAboutData({ ...aboutData, stats: updatedStats });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...aboutData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setAboutData({ ...aboutData, services: updatedServices });
  };

  const addStat = () => {
    setAboutData({
      ...aboutData,
      stats: [...aboutData.stats, { label: '', value: '', icon: '🚀' }]
    });
  };

  const removeStat = (index) => {
    setAboutData({
      ...aboutData,
      stats: aboutData.stats.filter((_, i) => i !== index)
    });
  };

  const addService = () => {
    setAboutData({
      ...aboutData,
      services: [...aboutData.services, { title: '', description: '', icon: '💼' }]
    });
  };

  const removeService = (index) => {
    setAboutData({
      ...aboutData,
      services: aboutData.services.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-teal text-xl">Loading about content...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal">About Content Management</h2>
          <p className="text-muted-silver">Manage your personal information and profile content</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-charcoal/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-soft-white mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-soft-white mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
                  placeholder="About Me"
                />
              </div>

              <div>
                <label className="block text-soft-white mb-2 font-medium">Short Description</label>
                <input
                  type="text"
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal"
                  placeholder="Brief introduction"
                />
              </div>

              <div>
                <label className="block text-soft-white mb-2 font-medium">Bio</label>
                <textarea
                  value={aboutData.bio}
                  onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 bg-navy-900 border border-muted-silver/30 rounded-lg text-soft-white focus:outline-none focus:border-teal resize-none"
                  placeholder="Detailed biography..."
                />
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="bg-charcoal/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-soft-white mb-4">Profile Image</h3>
            
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {aboutData.image ? (
                  <img 
                    src={aboutData.image} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-charcoal flex items-center justify-center">
                    <span className="text-muted-silver text-2xl">👤</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image-upload"
                />
                <label
                  htmlFor="profile-image-upload"
                  className="block px-4 py-2 bg-teal text-navy-900 rounded-lg cursor-pointer hover:bg-teal/90 transition-colors font-medium text-center"
                >
                  {uploading ? 'Uploading...' : 'Upload New Image'}
                </label>
                <p className="text-muted-silver text-sm mt-2">
                  Recommended: Square image, 500x500 pixels, max 2MB
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats and Services */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Statistics */}
          <div className="bg-charcoal/50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-soft-white">Statistics</h3>
              <Button size="small" onClick={addStat}>
                + Add Stat
              </Button>
            </div>
            
            <div className="space-y-3">
              {aboutData.stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-navy-900/50 rounded">
                  <input
                    type="text"
                    value={stat.icon}
                    onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                    className="w-16 px-2 py-1 bg-charcoal border border-muted-silver/30 rounded text-soft-white text-center"
                    placeholder="🚀"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    className="flex-1 px-3 py-1 bg-charcoal border border-muted-silver/30 rounded text-soft-white"
                    placeholder="Label (e.g., Projects Completed)"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    className="w-20 px-3 py-1 bg-charcoal border border-muted-silver/30 rounded text-soft-white"
                    placeholder="Value (e.g., 50+)"
                  />
                  <button
                    onClick={() => removeStat(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {aboutData.stats.length === 0 && (
                <div className="text-center py-4 text-muted-silver">
                  No statistics added. Add some to showcase your achievements.
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="bg-charcoal/50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-soft-white">Services</h3>
              <Button size="small" onClick={addService}>
                + Add Service
              </Button>
            </div>
            
            <div className="space-y-3">
              {aboutData.services.map((service, index) => (
                <div key={index} className="p-3 bg-navy-900/50 rounded space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                      className="w-16 px-2 py-1 bg-charcoal border border-muted-silver/30 rounded text-soft-white text-center"
                      placeholder="💼"
                    />
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                      className="flex-1 px-3 py-1 bg-charcoal border border-muted-silver/30 rounded text-soft-white"
                      placeholder="Service Title"
                    />
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-1 bg-charcoal border border-muted-silver/30 rounded text-soft-white resize-none"
                    placeholder="Service description..."
                  />
                </div>
              ))}

              {aboutData.services.length === 0 && (
                <div className="text-center py-4 text-muted-silver">
                  No services added. List the services you offer.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutManager;