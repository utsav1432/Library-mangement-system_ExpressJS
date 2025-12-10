const {BookModel, UserModel} = require("../models/index");
const IssuedBook = require("../dtos/book-dto");

// const getAllBooks = () => {}

// const getSingleBookById = () => {}

// Apporach of export

// module.exports = {
//     getAllBooks,
//     getSingleBookById
// }

exports.getAllBooks = async(req, res) => {
    const books = await BookModel.find()

    if (books.length === 0){
        return res.status(404).json({
            success: false,
            message: "No Books in the system"
        })
    }

    res.status(200).json({
        success: true,
        data: books
    })
}

exports.getSingleBookById = async(req, res) => {
    const {id} = req.params; 

     if (!id){
        return res.status(400).json({
            success: false,
            message: "Book ID is required"
        });
    }

    const book = await BookModel.findById(id);

    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id: ${id}`
        })
    }

    res.status(200).json({
        success: true,
        data: book
    })
}

exports.getAllIssuedBooks = async(req, res) => {
    const users = await UserModel.find({
        issuedBook: {$exists: true}
    }).populate("issuedBook")

    const issuedBook = users.map((req, res) => {
        return new IssuedBook(each);
    });

    if (issuedBook.length === 0){
        return res.status(404).json({
            success: false,
            message: "No Books issued yet"
        })
    }

    res.status(200).json({
        success: true,
        data: issuedBook
    })
}

exports.addNewBook = async(req, res) => {
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(404).json({
            success: false,
            message: "Please provide the data to add a new book"
        })
    }

    await BookModel.create(data);
    // res.status(200).json({
    //     success: true,
    //     message: "Book added successfully",
    //     data: data
    // })

    const allBooks = await BookModel.find()
    res.status(201).json({
        success: true,
        message: "Book added successfuly",
        data: allBooks
    })
}

exports.updateBookById = async (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    if (!data || Object.keys(data).length === 0){
        return res.status(404).json({
            success: false,
            message: "Please provide the data to update"
        })
    }

    const updatedBook = await BookModel.findOneAndUpdate(
        {_id: id},
        data,
        {new: true}
    )

    if(!updatedBook){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id:${id}`
        })
    }

    res.status(200).json({
        success: true,
        message: "Book Updated Successfully",
        data: updatedBook
    })
}

exports.deleteBookById = async (req, res) => {
    const {id} = req.params;

    const book = await BookModel.findById(id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id: ${id}`
        })
    }

    await BookModel.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Book Deleted Successfully"
    })
}