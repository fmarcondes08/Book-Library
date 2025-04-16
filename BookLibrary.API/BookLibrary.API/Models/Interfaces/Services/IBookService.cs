namespace BookLibrary.API.Models.Interfaces.Services
{
    public interface IBookService
    {
        /// <summary>
        /// Search Books
        /// </summary>
        /// <param name="searchBy"></param>
        /// <param name="searchValue"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns>Paged list of books and total items</returns>
        Task<(List<Book> Books, int TotalCount)> SearchBooksAsync(string searchBy, string searchValue, int page, int pageSize);
        /// <summary>
        /// Get book by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Book</returns>
        Task<Book> GetBookByIdAsync(int id);
        /// <summary>
        /// Add new book
        /// </summary>
        /// <param name="book"></param>
        /// <returns>New added book</returns>
        Task<Book> AddBookAsync(Book book);
        /// <summary>
        /// Update existing book
        /// </summary>
        /// <param name="book"></param>
        /// <returns></returns>
        Task UpdateBookAsync(Book book);
        /// <summary>
        /// Delete a book by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteBookAsync(int id);
    }
}
