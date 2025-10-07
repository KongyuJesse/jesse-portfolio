import React, { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, { ...action.payload, id: Date.now() + Math.random() }]
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload)
    case 'CLEAR_NOTIFICATIONS':
      return []
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, [])

  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: notification
    })
  }

  const removeNotification = (id) => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: id
    })
  }

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Default export for backward compatibility
export default useNotifications