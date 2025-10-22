import React, { createContext, useContext } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledNotification = styled.div`
  background: linear-gradient(135deg, #F2F2F2 0%, #EDECE3 100%);
  color: #303132;
  border: 2px solid ${props => {
    switch (props.type) {
      case 'success': return '#A90046';
      case 'error': return '#A90046';
      case 'warning': return '#90046';
      case 'info': return '#303132';
      default: return '#EDECE3';
    }
  }};
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(48, 49, 50, 0.2);
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const NotificationTitle = styled.strong`
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

export default function Notification({ 
  type = 'info', 
  title, 
  message, 
  isVisible = true,
  onClose,
  duration = 5000 
}) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <StyledNotification type={type} isVisible={isVisible}>
      <NotificationHeader>
        <NotificationTitle>{title}</NotificationTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </NotificationHeader>
      <NotificationMessage>{message}</NotificationMessage>
    </StyledNotification>
  );
}

// Contexto de notificaciones
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = React.useState([]);

  const showNotification = React.useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const hideNotification = React.useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </NotificationContainer>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}


