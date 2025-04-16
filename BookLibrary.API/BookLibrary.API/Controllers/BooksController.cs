using BookLibrary.API.DTOs;
using BookLibrary.API.Models;
using BookLibrary.API.Models.Interfaces.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Reflection.Metadata.BlobBuilder;

namespace BookLibrary.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;

        public BooksController(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        // GET: api/books/search?searchBy=title&searchValue=Potter&page=1&pageSize=10
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<object>> SearchBooks(
            [FromQuery] string searchBy,
            [FromQuery] string searchValue,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1)
                return BadRequest(new { success = false, message = "Page must be greater than zero." });

            if (pageSize < 1 || pageSize > 50)
                return BadRequest(new { success = false, message = "Page size must be between 1 and 50." });

            if (string.IsNullOrEmpty(searchBy) || string.IsNullOrEmpty(searchValue))
                return BadRequest(new { success = false, message = "Invalid search parameters." });

            var result = await _bookRepository.SearchBooksAsync(searchBy, searchValue, page, pageSize);

            var bookDtos = result.Books.Select(b => new BookDto
            {
                BookId = b.BookId,
                Title = b.Title,
                FirstName = b.FirstName,
                LastName = b.LastName,
                TotalCopies = b.TotalCopies,
                CopiesInUse = b.CopiesInUse,
                Type = b.Type,
                ISBN = b.ISBN,
                Category = b.Category
            }).ToList();

            return Ok(new { success = true, Books = bookDtos, TotalCount = result.TotalCount });
        }

        // GET: api/books/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _bookRepository.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound(new { success = false, message = $"Book with ID {id} not found." });
            }

            var bookDto = new BookDto
            {
                BookId = book.BookId,
                Title = book.Title,
                FirstName = book.FirstName,
                LastName = book.LastName,
                TotalCopies = book.TotalCopies,
                CopiesInUse = book.CopiesInUse,
                Type = book.Type,
                ISBN = book.ISBN,
                Category = book.Category
            };

            return Ok(new { success = true, Books = bookDto });
        }

        // POST: api/books
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BookDto>> CreateBook(BookDto bookDto)
        {
            if (string.IsNullOrEmpty(bookDto.Title))
                return BadRequest(new { success = false, message = "Book title is required." });

            if (string.IsNullOrEmpty(bookDto.ISBN))
                return BadRequest(new { success = false, message = "Book ISBN is required." });

            var book = new Book
            {
                Title = bookDto.Title,
                FirstName = bookDto.FirstName,
                LastName = bookDto.LastName,
                TotalCopies = bookDto.TotalCopies,
                CopiesInUse = bookDto.CopiesInUse,
                Type = bookDto.Type,
                ISBN = bookDto.ISBN,
                Category = bookDto.Category
            };

            await _bookRepository.AddBookAsync(book);
            bookDto.BookId = book.BookId;

            return Ok(new { success = true, Books = CreatedAtAction(nameof(GetBook), new { id = book.BookId }, bookDto) });
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateBook(int id, BookDto bookDto)
        {
            if (id != bookDto.BookId)
            {
                return BadRequest(new { success = false, message = "ID in URL does not match ID in request body." });
            }

            if (string.IsNullOrEmpty(bookDto.Title))
                return BadRequest(new { success = false, message = "Book title is required." });

            if (string.IsNullOrEmpty(bookDto.ISBN))
                return BadRequest(new { success = false, message = "Book ISBN is required." });


            var existingBook = await _bookRepository.GetBookByIdAsync(id);

            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = bookDto.Title;
            existingBook.FirstName = bookDto.FirstName;
            existingBook.LastName = bookDto.LastName;
            existingBook.TotalCopies = bookDto.TotalCopies;
            existingBook.CopiesInUse = bookDto.CopiesInUse;
            existingBook.Type = bookDto.Type;
            existingBook.ISBN = bookDto.ISBN;
            existingBook.Category = bookDto.Category;

            await _bookRepository.UpdateBookAsync(existingBook);

            return Ok(new { success = true, message = "Book updated successfully." });
        }

        // DELETE: api/books/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _bookRepository.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            await _bookRepository.DeleteBookAsync(id);

            return Ok(new { success = true, message = "Book deleted successfully." });
        }
    }
}
