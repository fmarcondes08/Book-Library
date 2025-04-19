import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../api/bookService';
import BookList from '../components/books/BookList';
import { Book } from '../interfaces/book.interface';
import { toast } from 'react-toastify';

const BookSearchPage: React.FC = () => {
  const [searchBy, setSearchBy] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchBooks = async () => {
    if (!searchBy || !searchValue) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await bookService.searchBooks(searchBy, searchValue, currentPage, pageSize);

      if (response.success && response.books) {
        const { books, totalCount } = response;
        setBooks(books as Book[]);
        setTotalCount(totalCount);
      } else {
        setError(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'An error occurred while fetching books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchBy && searchValue) {
      fetchBooks();
    }
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '1.5rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Royal Library</h1>
        <Link to="/books/create">Add New Book</Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div>
          <label htmlFor="searchBy">Search By:</label>
          <select
            id="searchBy"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            required
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div>
          <label htmlFor="searchValue">Search Value:</label>
          <input
            type="text"
            id="searchValue"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
            placeholder="Enter search term..."
          />
        </div>

        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Results */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {books.length > 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginTop: '2rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
                <h2>Search Results:</h2>
                <BookList 
                  books={books} 
                  totalCount={totalCount} 
                  currentPage={currentPage} 
                  pageSize={pageSize} 
                  onPageChange={handlePageChange}
                  onDeleteSuccess={fetchBooks}
                />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <h2>No results.</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookSearchPage;
