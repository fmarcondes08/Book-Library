using BookLibrary.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Book> Books { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        public void SeedData()
        {
            if (!Books.Any())
            {
                Books.AddRange(
                    new Book
                    {
                        Title = "Pride and Prejudice",
                        FirstName = "Jane",
                        LastName = "Austen",
                        TotalCopies = 100,
                        CopiesInUse = 80,
                        Type = "Hardcover",
                        ISBN = "1234567891",
                        Category = "Fiction"
                    },
                new Book
                {
                    Title = "To Kill a Mockingbird",
                    FirstName = "Harper",
                    LastName = "Lee",
                    TotalCopies = 75,
                    CopiesInUse = 65,
                    Type = "Paperback",
                    ISBN = "1234567892",
                    Category = "Fiction"
                },
                new Book
                {
                    Title = "The Catcher in the Rye",
                    FirstName = "J.D.",
                    LastName = "Salinger",
                    TotalCopies = 50,
                    CopiesInUse = 45,
                    Type = "Hardcover",
                    ISBN = "1234567893",
                    Category = "Fiction"
                },
                new Book
                {
                    Title = "The Great Gatsby",
                    FirstName = "F. Scott",
                    LastName = "Fitzgerald",
                    TotalCopies = 50,
                    CopiesInUse = 22,
                    Type = "Hardcover",
                    ISBN = "1234567894",
                    Category = "Non-Fiction"
                },
                new Book
                {
                    Title = "The Alchemist",
                    FirstName = "Paulo",
                    LastName = "Coelho",
                    TotalCopies = 50,
                    CopiesInUse = 35,
                    Type = "Hardcover",
                    ISBN = "1234567895",
                    Category = "Biography"
                },
                new Book
                {
                    Title = "The Book Thief",
                    FirstName = "Markus",
                    LastName = "Zusak",
                    TotalCopies = 75,
                    CopiesInUse = 11,
                    Type = "Hardcover",
                    ISBN = "1234567896",
                    Category = "Mystery"
                },
                new Book
                {
                    Title = "The Chronicles of Narnia",
                    FirstName = "C.S.",
                    LastName = "Lewis",
                    TotalCopies = 100,
                    CopiesInUse = 34,
                    Type = "Paperback",
                    ISBN = "1234567897",
                    Category = "Sci-Fi"
                }
                );
                SaveChanges();
            }
        }
    }
}
