import {bookModel} from "../model/book.model.js";

export const CreateBook = async (req, res) => {
  try {
    const {
      title,
      author,
      publishedDate,
      genre,
      price
    } = req.body;

    // assuming req.user is set by auth middleware
    const userId = req.user.id;
    console.log("🚀 ~ CreateBook ~ userId:", userId)

    const newBook = await bookModel.create({
      title,
      author,
      publishedDate,
      genre,
      price,
      user: userId
    });

    res.status(201).json({
      message: "Book created successfully",
      book: newBook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating book",
      error: error.message
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.find().populate("user", "username email");
    res.status(200).json({
      message: "Books retrieved successfully",
      books
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
};