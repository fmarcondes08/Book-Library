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
  onDeleteSuccess
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
    return <div>No books found.</div>;
  }

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Type</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{`${book.firstName} ${book.lastName}`}</td>
                <td>{book.type}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{`${book.totalCopies - book.copiesInUse}/${book.totalCopies}`}</td>
                <td>
                  <div>
                    <Link 
                      to={`/books/edit/${book.bookId}`}
                    >
                      Edit
                    </Link>
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
        <div>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;