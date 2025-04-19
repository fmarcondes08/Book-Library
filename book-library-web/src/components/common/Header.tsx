import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: '#1D4ED8', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        textAlign: 'center'
      }}>
        <Link 
          to="/" 
          style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}
        >
          Book Library Project
        </Link>

        <nav>
          <ul style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            listStyleType: 'none', 
            padding: 0, 
            margin: 0,
            justifyContent: 'center'
          }}>
            <li>
              <Link 
                to="/" 
                style={{ color: 'white', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BFDBFE'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Search
              </Link>
            </li>
            <li>
              <Link 
                to="/books/create" 
                style={{ color: 'white', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BFDBFE'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Add Book
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
