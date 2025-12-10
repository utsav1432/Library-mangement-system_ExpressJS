const express = require('express');
const dotenv = require('dotenv');

// Import database connection
const connectDB = require('./datebaseConnect')

// Impoting the routers
const usersRouter  = require('./routes/users');
const booksRouter  = require('./routes/books');

dotenv.config();

const app = express();

connectDB();

const port = 8081;

app.use(express.json());


// Home API
/**
 *  Route: /             (Home Page)
 */ 
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Home Page :-)",
    })
})

// Using the routers
app.use('/users', usersRouter);
app.use('/books', booksRouter);


// 404 Error
app.use( (req, res) => {
    res.status(500).json({
        message: `Not Built Yet :-(`
    })
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})