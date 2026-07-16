import { Request, Response } from "express";
import bookService from "../services/book.service";

class BookController {
  // Create Book
  async createBook(req: Request, res: Response) {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const data = {
      ...req.body,
      coverImage: req.file?.filename || "",
    };

    const result = await bookService.createBook(data);

    return res.status(201).json({
      success: true,
      message: "Book added successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
}

  // Get All Books
  async getAllBooks(req: Request, res: Response) {
    try {
      const result = await bookService.getAllBooks();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Single Book
  async getBookById(req: Request<{ id: string }>, res: Response) {
    try {
      const result = await bookService.getBookById(req.params.id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update Book
  async updateBook(req: Request<{ id: string }>, res: Response) {
    try {
      const result = await bookService.updateBook(
        req.params.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Book updated successfully.",
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete Book
  async deleteBook(req: Request<{ id: string }>, res: Response) {
    try {
      const result = await bookService.deleteBook(req.params.id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Search Books
  async searchBooks(req: Request, res: Response) {
    try {
      const keyword = (req.query.keyword as string) || "";

      const result = await bookService.searchBooks(keyword);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new BookController();