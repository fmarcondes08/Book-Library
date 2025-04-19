import React from 'react';
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

const BookCreatePage: React.FC = () => {
  const handleSubmit = async (values: Book) => {
    try {
      const response = await bookService.createBook(values);
      
      if (response.success) {
        toast.success('Book added successfully!');
      } else {
        throw new Error(response.message || 'Failed to add book');
      }
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
      throw error;
    }
  };

  return (
    <div>
      <BookForm 
        initialValues={initialValues} 
        onSubmit={handleSubmit} 
        isEditing={false} 
      />
    </div>
  );
};

export default BookCreatePage;