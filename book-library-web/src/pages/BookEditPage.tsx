import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../components/books/BookForm';
import { Book } from '../interfaces/book.interface';
import { bookService } from '../api/bookService';
import { toast } from 'react-toastify';

const initialValues: Book = {
  title: '',
  firstName: '',
  lastName: '',
  totalCopies: 1,
  copiesInUse: 0,
  type: '',
  isbn: '',
  category: ''
};

const BookEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>(initialValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) {
          throw new Error('Book ID is required');
        }

        const response = await bookService.getBookById(parseInt(id));
        
        if (response.success && response.books) {
          setBook(response.books as Book);
        } else {
          throw new Error(response.message || 'Failed to fetch book');
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : 'An error occurred while fetching the book');
        toast.error(`Error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (values: Book) => {
    try {
      if (!id) {
        throw new Error('Book ID is required');
      }

      const response = await bookService.updateBook(parseInt(id), values);
      
      if (response.success) {
        toast.success('Book updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update book');
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading book details...</div>;
  }

  if (error) {
    return (
      <div>
        <div>
          {error}
        </div>
        <button 
          onClick={() => navigate('/')}
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Book</h1>
      <BookForm 
        initialValues={book} 
        onSubmit={handleSubmit} 
        isEditing={true} 
      />
    </div>
  );
};

export default BookEditPage;