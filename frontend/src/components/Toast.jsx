import React, { useEffect } from 'react';

const Toast = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  console.log("Rendering toast:", message);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#dc3545',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      fontSize: '14px',
      maxWidth: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
          marginLeft: '10px',
          padding: '0'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
