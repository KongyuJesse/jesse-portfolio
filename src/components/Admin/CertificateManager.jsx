// src/components/Admin/CertificateManager.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CertificateForm from './CertificateForm';
import  api  from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const CertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await api.getCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load certificates'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCertificate(null);
    setShowForm(true);
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  const handleDelete = async (certificateId) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await api.deleteCertificate(certificateId);
        setCertificates(certificates.filter(c => c._id !== certificateId));
        addNotification({
          type: 'success',
          title: 'Success!',
          message: 'Certificate deleted successfully'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete certificate'
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCertificate(null);
    fetchCertificates();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCertificate(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-teal text-xl">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal">Certificates Management</h2>
          <p className="text-muted-silver">Manage your professional certifications and achievements</p>
        </div>
        <Button onClick={handleCreate}>
          + Add New Certificate
        </Button>
      </div>

      <div className="grid gap-6">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-charcoal/50 rounded-lg p-6 border border-muted-silver/20 hover:border-teal/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={certificate.image} 
                  alt={certificate.name}
                  className="w-32 h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-soft-white">{certificate.name}</h3>
                    <p className="text-muted-silver">Issued by: {certificate.issuer}</p>
                  </div>
                  {certificate.featured && (
                    <span className="px-2 py-1 bg-teal/20 text-teal rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-muted-silver mb-3 line-clamp-2">{certificate.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {certificate.skills?.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-navy-900 text-teal text-sm rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-silver">
                  <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                  {certificate.credentialUrl && (
                    <>
                      <span>•</span>
                      <a 
                        href={certificate.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal hover:underline"
                      >
                        Verify Credential
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 self-start">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(certificate)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleDelete(certificate._id)}
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {certificates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-soft-white mb-2">No Certificates Yet</h3>
            <p className="text-muted-silver mb-6">Showcase your professional achievements by adding certificates</p>
            <Button onClick={handleCreate}>
              Add Your First Certificate
            </Button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={handleFormCancel}
        title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
      >
        <CertificateForm
          certificate={editingCertificate}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
};

export default CertificateManager;