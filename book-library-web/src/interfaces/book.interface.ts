export interface Book {
  bookId?: number;
  title: string;
  firstName: string;
  lastName: string;
  totalCopies: number;
  copiesInUse: number;
  type: string;
  isbn: string;
  category: string;
}

export interface BookResponse {
  success: boolean;
  books?: Book | Book[];
  totalCount: number;
  message?: string;
}