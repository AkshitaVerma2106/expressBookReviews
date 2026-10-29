const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered"
  });
});
// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = decodeURIComponent(req.params.author).toLowerCase();

  const result = Object.values(books).filter(book =>
    book.author.toLowerCase() === author
  );

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();

  const result = Object.values(books).filter(book =>
    book.title.toLowerCase() === title
  );

  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
module.exports.general = public_users;

const API_BASE_URL = "http://localhost:5001";

// Get all books using Axios and async/await
async function getAllBooks() {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving all books:", error.message);
    throw error;
  }
}

// Get a book by ISBN
async function getBooksByISBN(isbn) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/isbn/${encodeURIComponent(isbn)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving book by ISBN:", error.message);
    throw error;
  }
}

// Get books by author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/author/${encodeURIComponent(author)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by author:", error.message);
    throw error;
  }
}

// Get books by title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/title/${encodeURIComponent(title)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by title:", error.message);
    throw error;
  }
}

// Export the Axios functions
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
