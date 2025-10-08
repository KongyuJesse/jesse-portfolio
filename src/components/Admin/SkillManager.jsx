import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSkills, updateSkills } from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import { getSkillLogo } from '../../utils/skillLogos';
import Button from '../UI/Button';

const SkillManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addNotification } = useNotifications();

  const categories = {
    frontend: 'Frontend Technologies',
    backend: 'Backend Technologies',
    design: 'Design Tools',
    soft: 'Professional Skills'
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load skills'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const newSkill = {
      _id: `temp-${Date.now()}`,
      name: '',
      category: 'frontend',
      level: 50,
      logo: '',
      featured: false,
      isNew: true
    };
    setSkills([...skills, newSkill]);
  };

  const handleUpdateSkill = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };

    // Auto-assign logo when skill name changes
    if (field === 'name' && value.trim()) {
      const logo = getSkillLogo(value);
      updatedSkills[index].logo = logo;
    }

    setSkills(updatedSkills);
  };

  const handleRemoveSkill = (index) => {
    const skillToRemove = skills[index];
    if (skillToRemove.isNew) {
      setSkills(skills.filter((_, i) => i !== index));
    } else if (window.confirm('Are you sure you want to remove this skill?')) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    try {
      const skillsToSave = skills.map(skill => ({
        name: skill.name,
        category: skill.category,
        level: parseInt(skill.level),
        logo: skill.logo,
        featured: skill.featured,
        order: skills.indexOf(skill)
      }));

      await updateSkills(skillsToSave);
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Skills updated successfully'
      });
      fetchSkills(); // Reload to get proper IDs
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update skills'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-teal text-xl">Loading skills...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal">Skills Management</h2>
          <p className="text-muted-silver">Manage your technical and professional skills</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleAddSkill}>
            + Add New Skill
          </Button>
          <Button 
            onClick={handleSaveSkills} 
            disabled={saving}
            variant="secondary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([categoryKey, categoryName]) => {
          const categorySkills = skills.filter(skill => skill.category === categoryKey);
          
          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal/50 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-soft-white mb-4">{categoryName}</h3>
              
              <div className="space-y-4">
                {categorySkills.map((skill, index) => {
                  const globalIndex = skills.findIndex(s => s._id === skill._id);
                  return (
                    <div key={skill._id} className="flex items-center space-x-4 p-4 bg-navy-900/50 rounded-lg">
                      {/* Logo Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-charcoal rounded-lg flex items-center justify-center">
                          {skill.logo ? (
                            <img 
                              src={skill.logo} 
                              alt={skill.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <span className="text-muted-silver">⚡</span>
                          )}
                        </div>
                      </div>

                      {/* Skill Name */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleUpdateSkill(globalIndex, 'name', e.target.value)}
                          placeholder="Skill name (e.g., React, Node.js, Problem Solving)"
                          className="w-full px-3 py-2 bg-charcoal border border-muted-silver/30 rounded text-soft-white focus:outline-none focus:border-teal"
                        />
                      </div>

                      {/* Category */}
                      <div className="w-32">
                        <select
                          value={skill.category}
                          onChange={(e) => handleUpdateSkill(globalIndex, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-charcoal border border-muted-silver/30 rounded text-soft-white focus:outline-none focus:border-teal text-sm"
                        >
                          {Object.entries(categories).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Level */}
                      <div className="w-48">
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleUpdateSkill(globalIndex, 'level', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-teal font-medium w-12">{skill.level}%</span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveSkill(globalIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {categorySkills.length === 0 && (
                  <div className="text-center py-4 text-muted-silver">
                    No skills in this category yet.
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-xl font-semibold text-soft-white mb-2">No Skills Configured</h3>
          <p className="text-muted-silver mb-6">Start by adding your technical and professional skills</p>
          <Button onClick={handleAddSkill}>
            Add Your First Skill
          </Button>
        </div>
      )}
    </div>
  );
};

export default SkillManager;