import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#FEE2E2',
        border: '1px solid #F87171',
        color: '#B91C1C',
        padding: '1rem',
        borderRadius: '0.5rem',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: '250px',
      }}
    >
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
