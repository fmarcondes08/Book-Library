using BookLibrary.API.Models;
using BookLibrary.API.Models.Interfaces.Repositories;
using BookLibrary.API.Models.Interfaces.Services;

namespace BookLibrary.API.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;

        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<Book> AddBookAsync(Book book)
        {
            return await _bookRepository.AddBookAsync(book);
        }

        public async Task DeleteBookAsync(int id)
        {
            await _bookRepository.DeleteBookAsync(id);
        }

        public async Task<Book> GetBookByIdAsync(int id)
        {
            return await GetBookByIdAsync(id);
        }

        public async Task<(List<Book> Books, int TotalCount)> SearchBooksAsync(string searchBy, string searchValue, int page, int pageSize)
        {
            return await SearchBooksAsync(searchBy, searchValue, page, pageSize);
        }

        public async Task UpdateBookAsync(Book book)
        {
            await _bookRepository.UpdateBookAsync(book);
        }
    }
}
