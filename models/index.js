const UserModel = require('./user-model');
const BookModel = require('./book-model');

module.exports = {
    UserModel,
    BookModel
};
//  This file serves as an index for the model, allowing in other parts of the application.
// It exports the UserModel and BookModel, which can be used in routes or controller to interact with the database. 