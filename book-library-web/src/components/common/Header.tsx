import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Book Library Project</Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-200">Search</Link>
            </li>
            <li>
              <Link to="/books/create" className="hover:text-blue-200">Add Book</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;