// src/components/Admin/MessageManager.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMessages, markMessageAsRead } from '../../utils/api';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../UI/Button';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load messages'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
      addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Message marked as read'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to mark message as read'
      });
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      handleMarkAsRead(message._id);
    }
  };

  const getStatusBadge = (message) => {
    if (!message.read) {
      return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">New</span>;
    }
    if (message.replied) {
      return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Replied</span>;
    }
    return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Read</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-teal text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal">Messages Management</h2>
          <p className="text-muted-silver">View and manage contact form messages</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-silver">
            {messages.filter(m => !m.read).length} unread messages
          </div>
          <Button onClick={fetchMessages} variant="secondary">
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Messages List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft-white mb-4">All Messages ({messages.length})</h3>
          
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold text-soft-white mb-2">No Messages Yet</h3>
              <p className="text-muted-silver">Contact form messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedMessage?._id === message._id
                      ? 'bg-teal/20 border-teal'
                      : message.read
                      ? 'bg-charcoal/50 border-muted-silver/20'
                      : 'bg-blue-500/10 border-blue-500/30'
                  } hover:border-teal/50`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          message.read ? 'text-soft-white' : 'text-blue-400'
                        }`}>
                          {message.name}
                        </h4>
                        {getStatusBadge(message)}
                      </div>
                      <p className="text-muted-silver text-sm mb-1">{message.email}</p>
                      <p className="text-soft-white font-medium truncate">{message.subject}</p>
                    </div>
                    <div className="text-right text-xs text-muted-silver">
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                  <p className="text-muted-silver text-sm line-clamp-2">
                    {message.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-charcoal/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-soft-white mb-4">Message Details</h3>
          
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-muted-silver/20">
                <div>
                  <h4 className="text-xl font-bold text-teal">{selectedMessage.subject}</h4>
                  <p className="text-muted-silver">{formatDate(selectedMessage.createdAt)}</p>
                </div>
                {getStatusBadge(selectedMessage)}
              </div>

              <div>
                <h5 className="text-soft-white font-semibold mb-2">From</h5>
                <div className="bg-navy-900/50 rounded-lg p-4">
                  <p className="text-soft-white font-medium">{selectedMessage.name}</p>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-teal hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div>
                <h5 className="text-soft-white font-semibold mb-2">Message</h5>
                <div className="bg-navy-900/50 rounded-lg p-4">
                  <p className="text-soft-white whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-muted-silver/20">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=Hello ${selectedMessage.name},%0D%0A%0D%0A`}
                  className="flex-1 px-4 py-2 bg-teal text-navy-900 rounded-lg hover:bg-teal/90 transition-colors font-medium text-center"
                >
                  Reply via Email
                </a>
                {!selectedMessage.read && (
                  <Button
                    variant="secondary"
                    onClick={() => handleMarkAsRead(selectedMessage._id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-silver">
              <div className="text-4xl mb-4">📨</div>
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageManager;