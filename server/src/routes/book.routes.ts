import { Router } from "express";
import bookController from "../controllers/book.controller";
import { authorizedMiddleware } from "../middleware/auth.middlware";
import { uploads } from "../middleware/upload.middlware";


const router = Router();

// View Books
router.get("/", authorizedMiddleware, bookController.getAllBooks);

// Search Books
router.get("/search", authorizedMiddleware, bookController.searchBooks);

// View Single Book
router.get("/:id", authorizedMiddleware, bookController.getBookById);

// Create Book

router.post(
  "/",
  uploads.book.single("coverImage"),
  bookController.createBook
);


// Update Book
router.put("/:id", authorizedMiddleware, bookController.updateBook);

// Delete Book
router.delete("/:id", authorizedMiddleware, bookController.deleteBook);

export default router;