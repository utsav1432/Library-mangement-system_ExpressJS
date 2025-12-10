const express = require('express');
const { users } = require('../data/users.json');
const { getAllUser, getSingleUserById, createUser, updateUserById, deleteUserById, getSubscriptionDetailsById } = require('../controllers/user-controller');

const router = express.Router();

// Users APIs

/**
 * Route: /users
 * Method: GET
 * Description: Get all the list of users in the system
 * Access: Public
 * Paramaters: None
 */
router.get('/', getAllUser)


/**
 * Route: /users
 * Method: POST
 * Description: Create/Register a new user
 * Access: Public
 * Paramaters: none
 */
router.post('/', createUser)


/**
 * Route: /users/:id
 * Method: GET
 * Description: Get a user by their ID
 * Access: Public
 * Paramaters: id
 */
router.get('/:id', getSingleUserById)


/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating a user by their ID
 * Access: Public
 * Paramaters: id
 */
router.put('/:id', updateUserById)


/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their ID 
 * Access: Public
 * Paramaters: id
 */
router.delete('/:id', deleteUserById)

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their ID 
 * Access: Public
 * Paramaters: id
 */
router.get('/subscription-details/:id', getSubscriptionDetailsById)


module.exports = router;
// This is the users router for the library management system