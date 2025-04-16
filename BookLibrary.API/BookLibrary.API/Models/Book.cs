using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.API.Models
{
    public class Book
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }

        public int TotalCopies { get; set; }

        public int CopiesInUse { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; }

        [Required]
        [MaxLength(50)]
        public string ISBN { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; }
    }
}
