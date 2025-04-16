using BookLibrary.API.Models;
using BookLibrary.API.Models.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.API.Data.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BookRepository> _logger;

        public BookRepository(ApplicationDbContext context, ILogger<BookRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(List<Book> Books, int TotalCount)> SearchBooksAsync(
            string searchBy,
            string searchValue,
            int page = 1,
            int pageSize = 10)
        {
            try
            {
                IQueryable<Book> query = _context.Books;

                // Apply search filter
                if (!string.IsNullOrEmpty(searchBy) && !string.IsNullOrEmpty(searchValue))
                {
                    searchValue = searchValue.ToLower();

                    query = searchBy.ToLower() switch
                    {
                        "title" => query.Where(b => b.Title.ToLower().Contains(searchValue)),
                        "author" => query.Where(b =>
                                (b.FirstName + " " + b.LastName).ToLower().Contains(searchValue)),
                        "isbn" => query.Where(b => b.ISBN.ToLower().Contains(searchValue)),
                        "category" => query.Where(b => b.Category.ToLower() == searchValue),
                        _ => query
                    };
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var books = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (books, totalCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching books: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<Book> GetBookByIdAsync(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);

                if (book == null)
                {
                    throw new KeyNotFoundException($"Book with ID {id} was not found.");
                }

                return book;
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning("Attempt to access non-existent book with ID: {BookId}", id);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book by ID {BookId}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<Book> AddBookAsync(Book book)
        {
            try
            {
                // Check if ISBN already exists
                var existingBook = await _context.Books.FirstOrDefaultAsync(b => b.ISBN == book.ISBN);
                if (existingBook != null)
                {
                    throw new InvalidOperationException($"A book with ISBN {book.ISBN} already exists.");
                }

                _context.Books.Add(book);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Book added successfully: {BookTitle} (ID: {BookId})", book.Title, book.BookId);
                return book;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error saving book to database: {Message}", ex.Message);
                throw new InvalidOperationException("Error saving book to database.", ex);
            }
            catch (Exception ex) when (!(ex is ArgumentException || ex is InvalidOperationException))
            {
                _logger.LogError(ex, "Unexpected error adding book: {Message}", ex.Message);
                throw;
            }
        }

        public async Task UpdateBookAsync(Book book)
        {
            try
            {
                // Check if book exists
                var existingBook = await _context.Books.AsNoTracking().FirstOrDefaultAsync(b => b.BookId == book.BookId);
                if (existingBook == null)
                {
                    throw new KeyNotFoundException($"Book with ID {book.BookId} not found.");
                }

                // Check if updating to an ISBN that already exists on another book
                var duplicateISBN = await _context.Books
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.ISBN == book.ISBN && b.BookId != book.BookId);

                if (duplicateISBN != null)
                {
                    throw new InvalidOperationException($"Another book already uses ISBN {book.ISBN}.");
                }

                _context.Entry(book).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                _logger.LogInformation("Book updated successfully: {BookTitle} (ID: {BookId})", book.Title, book.BookId);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error updating book {BookId}: {Message}", book.BookId, ex.Message);
                throw new InvalidOperationException("Error updating book in database.", ex);
            }
            catch (Exception ex) when (!(ex is ArgumentException || ex is InvalidOperationException || ex is KeyNotFoundException))
            {
                _logger.LogError(ex, "Unexpected error updating book {BookId}: {Message}", book.BookId, ex.Message);
                throw;
            }
        }

        public async Task DeleteBookAsync(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);
                if (book == null)
                {
                    throw new KeyNotFoundException($"Book with ID {id} not found.");
                }

                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Book deleted successfully: {BookTitle} (ID: {BookId})", book.Title, book.BookId);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error deleting book {BookId}: {Message}", id, ex.Message);
                throw new InvalidOperationException("Error deleting book from database.", ex);
            }
            catch (Exception ex) when (!(ex is InvalidOperationException || ex is KeyNotFoundException))
            {
                _logger.LogError(ex, "Unexpected error deleting book {BookId}: {Message}", id, ex.Message);
                throw;
            }
        }
    }
}
