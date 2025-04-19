import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1F2937', // equivalente ao bg-gray-800
        color: 'white',
        padding: '1rem 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
        }}
      >
        <p>Book Library Project &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
