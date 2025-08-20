import { Document, Model, Query } from 'mongoose';

class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering (gt, gte, lt, lte)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { description: searchRegex },
          { publisher: searchRegex },
          { isbn: searchRegex }
        ]
      });
    }
    return this;
  }

  advancedSearch() {
    const {
      title,
      author,
      publisher,
      isbn,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      publishedBefore,
      publishedAfter,
      exactMatch
    } = this.queryString;

    const searchQuery: Record<string, any> = {};

    // Function to create regex or exact match based on exactMatch flag
    const createSearchPattern = (field: string, value: string) => {
      if (exactMatch === 'true') {
        return { [field]: value };
      }
      return { [field]: new RegExp(value, 'i') };
    };

    // Title search
    if (title) {
      Object.assign(searchQuery, createSearchPattern('title', title));
    }

    // Author search
    if (author) {
      Object.assign(searchQuery, createSearchPattern('author', author));
    }

    // Publisher search
    if (publisher) {
      Object.assign(searchQuery, createSearchPattern('publisher', publisher));
    }

    // ISBN search (usually exact)
    if (isbn) {
      Object.assign(searchQuery, { isbn: new RegExp(isbn, 'i') });
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) {
        searchQuery.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        searchQuery.price.$lte = Number(maxPrice);
      }
    }

    // Stock range
    if (minStock !== undefined || maxStock !== undefined) {
      searchQuery.stock = {};
      if (minStock !== undefined) {
        searchQuery.stock.$gte = Number(minStock);
      }
      if (maxStock !== undefined) {
        searchQuery.stock.$lte = Number(maxStock);
      }
    }

    // Published date range
    if (publishedBefore || publishedAfter) {
      searchQuery.publishedDate = {};
      if (publishedAfter) {
        searchQuery.publishedDate.$gte = new Date(publishedAfter);
      }
      if (publishedBefore) {
        searchQuery.publishedDate.$lte = new Date(publishedBefore);
      }
    }

    // Apply the search query if it's not empty
    if (Object.keys(searchQuery).length > 0) {
      this.query = this.query.find(searchQuery);
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;