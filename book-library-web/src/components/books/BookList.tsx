import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../interfaces/book.interface';
import { bookService } from '../../api/bookService';
import { toast } from 'react-toastify';

interface BookListProps {
  books: Book[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteSuccess: () => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onDeleteSuccess,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      setDeletingId(id);
      await bookService.deleteBook(id);
      toast.success('Book deleted successfully');
      onDeleteSuccess();
    } catch (error) {
      toast.error(`Error deleting book: ${error}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (books.length === 0) {
    return <div style={{ textAlign: 'center' }}>No books found.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            maxWidth: '1000px',
            border: '1px solid #ccc',
          }}
        >
          <thead>
            <tr>
              {['Book Title', 'Author', 'Type', 'ISBN', 'Category', 'Available', 'Actions'].map((header) => (
                <th
                  key={header}
                  style={{
                    border: '1px solid #ccc',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    textAlign: 'left',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td style={cellStyle}>{book.title}</td>
                <td style={cellStyle}>{`${book.firstName} ${book.lastName}`}</td>
                <td style={cellStyle}>{book.type}</td>
                <td style={cellStyle}>{book.isbn}</td>
                <td style={cellStyle}>{book.category}</td>
                <td style={cellStyle}>{`${book.totalCopies - book.copiesInUse}/${book.totalCopies}`}</td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/books/edit/${book.bookId}`}>Edit</Link>
                    <button
                      onClick={() => book.bookId && handleDelete(book.bookId)}
                      disabled={deletingId === book.bookId}
                    >
                      {deletingId === book.bookId ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => onPageChange(page)}>
              {page}
            </button>
          ))}

          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '0.75rem',
};

export default BookList;
