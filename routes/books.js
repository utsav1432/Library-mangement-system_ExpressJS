const express = require('express');
const { books } = require('../data/books.json');
const { users } = require('../data/users.json');

// Calling MongoDB Models
const { UserModel, BookModel } = require("../models/index");
const { getAllBooks, getSingleBookById, getAllIssuedBooks, addNewBook, updateBookById, deleteBookById } = require('../controllers/book-controller');

// Another of calling MongoDb Models
// conste UserModel = require('../models/user.model');
// conste BookModel = require('../models/book.model');

const router = express.Router();

// Books APIs

/**
 * Route: /books
 * Method: GET
 * Description: Get all the books in the system
 * Access: Public
 * Paramaters: None
 */
router.get('/', getAllBooks)



/**
 * Route: /books
 * Method: POST
 * Description: Add a new book to the System
 * Access: Public
 * Paramaters: none
 */
router.post('/', addNewBook)


/**
 * Route: /books/:id
 * Method: GET
 * Description: Get a book by its ID
 * Access: Public
 * Paramaters: id
 */
router.get('/:id', getSingleBookById)


/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update a book by its ID
 * Access: Public
 * Paramaters: id
 */
router.put('/:id', updateBookById)


/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete a book by its ID
 * Access: Public
 * Paramaters: id
 */
router.delete('/:id', deleteBookById)



// Issued Books api is not working ask to mentor 

/**
 * Route: /books/issued/for-users
 * Method: GET
 * Description: Get all the issued books 
 * Access: Public
 * Paramaters: None
 */
router.get('/issued/for-users', getAllIssuedBooks);


module.exports = router;