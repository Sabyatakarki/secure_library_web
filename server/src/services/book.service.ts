import Book from "../models/book.model";
import { HttpError } from "../error/http-error";

class BookService {
  // Create Book
  async createBook(data: any) {
    const existingBook = await Book.findOne({
      isbn: data.isbn,
    });

    if (existingBook) {
      throw new HttpError(400, "Book with this ISBN already exists.");
    }

    const book = await Book.create(data);

    return book;
  }

  // Get All Books
  async getAllBooks() {
    return await Book.find().sort({
      createdAt: -1,
    });
  }

  // Get Book By ID
  async getBookById(id: string) {
    const book = await Book.findById(id);

    if (!book) {
      throw new HttpError(404, "Book not found.");
    }

    return book;
  }

  // Update Book
  async updateBook(id: string, data: any) {
    const book = await Book.findById(id);

    if (!book) {
      throw new HttpError(404, "Book not found.");
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedBook;
  }

  // Delete Book
  async deleteBook(id: string) {
    const book = await Book.findById(id);

    if (!book) {
      throw new HttpError(404, "Book not found.");
    }

    await Book.findByIdAndDelete(id);

    return {
      message: "Book deleted successfully.",
    };
  }

  // Search Books
  async searchBooks(keyword: string) {
    return await Book.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          author: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          isbn: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });
  }
}

export default new BookService();