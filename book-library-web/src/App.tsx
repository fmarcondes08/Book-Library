import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import BookSearchPage from './pages/BookSearchPage';
import BookCreatePage from './pages/BookCreatePage';
import BookEditPage from './pages/BookEditPage';

// Import components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        
        <main className="flex-grow py-8">
          <Routes>
            <Route path="/" element={<BookSearchPage />} />
            <Route path="/books/create" element={<BookCreatePage />} />
            <Route path="/books/edit/:id" element={<BookEditPage />} />
          </Routes>
        </main>
        
        <Footer />
        
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
};

export default App;