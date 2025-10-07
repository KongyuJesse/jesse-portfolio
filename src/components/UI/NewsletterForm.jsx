import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeToNewsletter } from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      addNotification({
        type: 'error',
        title: 'Email Required',
        message: 'Please enter your email address'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(email);
      addNotification({
        type: 'success',
        title: 'Subscribed Successfully!',
        message: 'Thank you for subscribing to my newsletter. You will receive a welcome email shortly.'
      });
      setEmail('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Subscription Failed',
        message: error.message || 'Failed to subscribe. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4"
      variants={itemVariants}
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 px-6 py-4 bg-charcoal/50 backdrop-blur-sm border border-teal/20 rounded-2xl text-soft-white placeholder-muted-silver focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-300 disabled:opacity-50"
        required
      />
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-4 bg-gradient-to-r from-teal to-blue-500 text-charcoal font-semibold rounded-2xl hover:shadow-lg hover:shadow-teal/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        whileHover={{ scale: isSubmitting ? 1 : 1.05, y: isSubmitting ? 0 : -2 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
      >
        {isSubmitting ? (
          <motion.div
            className="flex items-center space-x-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
            <span>Subscribing...</span>
          </motion.div>
        ) : (
          'Subscribe'
        )}
      </motion.button>
    </motion.form>
  );
};

// Add this variant for the form
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default NewsletterForm;