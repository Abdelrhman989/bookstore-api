import { FilterQuery } from 'mongoose';
import { Book } from '../models/book.model';
import APIFeatures from '../utils/apiFeatures';
import logger from '../utils/logger';

/**
 * Book Service - Contains business logic related to books
 */
export class BookService {
  /**
   * Get list of books with support for filtering, searching, sorting, and pagination
   */
  async getBooks(queryParams: any) {
    try {
      const features = new APIFeatures(Book.find(), queryParams)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

      // Execute the query
      const books = await features.query;

      // Get total number of books (for pagination)
      const count = await Book.countDocuments(features.filter());

      return {
        success: true,
        count,
        totalPages: Math.ceil(count / (queryParams.limit * 1 || 10)),
        currentPage: queryParams.page * 1 || 1,
        data: books,
      };
    } catch (error) {
      logger.error(`Error in getBooks service: ${error}`);
      throw error;
    }
  }

  /**
   * Get a book by ID
   */
  async getBookById(id: string) {
    try {
      const book = await Book.findById(id);
      if (!book) {
        const error = new Error('Book not found') as any;
        error.statusCode = 404;
        throw error;
      }
      return { success: true, data: book };
    } catch (error) {
      logger.error(`Error in getBookById service: ${error}`);
      throw error;
    }
  }

  /**
   * Create a new book
   */
  async createBook(bookData: any) {
    try {
      // Check if a book with the same ISBN already exists
      const existingBook = await Book.findOne({ isbn: bookData.isbn });
      if (existingBook) {
        const error = new Error('A book with the same ISBN already exists') as any;
        error.statusCode = 400;
        throw error;
      }

      const book = await Book.create(bookData);
      return { success: true, data: book };
    } catch (error) {
      logger.error(`Error in createBook service: ${error}`);
      throw error;
    }
  }

  /**
   * Update a book
   */
  async updateBook(id: string, bookData: any) {
    try {
      const book = await Book.findByIdAndUpdate(id, bookData, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        const error = new Error('Book not found') as any;
        error.statusCode = 404;
        throw error;
      }

      return { success: true, data: book };
    } catch (error) {
      logger.error(`Error in updateBook service: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a book
   */
  async deleteBook(id: string) {
    try {
      const book = await Book.findByIdAndDelete(id);

      if (!book) {
        const error = new Error('Book not found') as any;
        error.statusCode = 404;
        throw error;
      }

      return { success: true, message: 'Book deleted successfully' };
    } catch (error) {
      logger.error(`Error in deleteBook service: ${error}`);
      throw error;
    }
  }

  /**
   * Get books with low stock
   */
  async getLowStockBooks(threshold: number = 5) {
    try {
      const books = await Book.find({ stock: { $lte: threshold } });
      return { success: true, count: books.length, data: books };
    } catch (error) {
      logger.error(`Error in getLowStockBooks service: ${error}`);
      throw error;
    }
  }

  /**
   * Update book stock
   */
  async updateBookStock(id: string, stock: number) {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { stock },
        { new: true, runValidators: true }
      );

      if (!book) {
        const error = new Error('Book not found') as any;
        error.statusCode = 404;
        throw error;
      }

      return { success: true, data: book };
    } catch (error) {
      logger.error(`Error in updateBookStock service: ${error}`);
      throw error;
    }
  }

  /**
   * Advanced search for books
   */
  async advancedSearchBooks(queryParams: any) {
    try {
      const features = new APIFeatures(Book.find(), queryParams)
        .filter()
        .advancedSearch()
        .sort()
        .limitFields()
        .paginate();

      // Execute the query
      const books = await features.query;

      // Get total number of books (for pagination)
      const count = await Book.countDocuments(features.filter());

      return {
        success: true,
        count,
        totalPages: Math.ceil(count / (queryParams.limit * 1 || 10)),
        currentPage: queryParams.page * 1 || 1,
        data: books,
      };
    } catch (error) {
      logger.error(`Error in advancedSearchBooks service: ${error}`);
      throw error;
    }
  }
}

export default new BookService();