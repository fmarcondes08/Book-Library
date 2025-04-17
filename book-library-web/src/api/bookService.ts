import axios from 'axios';
import { Book, BookResponse } from '../interfaces/book.interface';

const API_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle API errors consistently
api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject(errorMessage);
  }
);

export const bookService = {
  // Get books with search and pagination
  searchBooks: async (searchBy: string, searchValue: string, page: number = 1, pageSize: number = 10): Promise<BookResponse> => {
    const response = await api.get(
      `/books/search?searchBy=${searchBy}&searchValue=${encodeURIComponent(searchValue)}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get book by ID
  getBookById: async (id: number): Promise<BookResponse> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create new book
  createBook: async (book: Book): Promise<BookResponse> => {
    const response = await api.post('/books', book);
    return response.data;
  },

  // Update existing book
  updateBook: async (id: number, book: Book): Promise<BookResponse> => {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },

  // Delete book
  deleteBook: async (id: number): Promise<BookResponse> => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }
};