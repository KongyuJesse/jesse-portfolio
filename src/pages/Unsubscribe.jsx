import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { unsubscribeFromNewsletter } from '../utils/api';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link');
      return;
    }

    const unsubscribe = async () => {
      try {
        await unsubscribeFromNewsletter(token);
        setStatus('success');
        setMessage('You have been successfully unsubscribed from our newsletter.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Failed to unsubscribe. Please try again.');
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-charcoal/30 backdrop-blur-sm rounded-3xl p-8 border border-teal/20 text-center">
        <div className="text-6xl mb-6">
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
        </div>
        <h1 className="text-3xl font-bold text-soft-white mb-4">
          {status === 'loading' ? 'Processing...' : status === 'success' ? 'Unsubscribed' : 'Error'}
        </h1>
        <p className="text-muted-silver text-lg mb-6">
          {message}
        </p>
        {status !== 'loading' && (
          <a 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-xl hover:shadow-lg transition-all duration-300 inline-block"
          >
            Return to Homepage
          </a>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;