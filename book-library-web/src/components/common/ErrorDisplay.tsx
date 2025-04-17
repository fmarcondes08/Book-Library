import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;