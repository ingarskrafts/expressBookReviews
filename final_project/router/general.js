const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');

        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books using Axios"});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });

 // Task 11: Get book details based on ISBN using async-await with Axios
 public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

       // return res.send(JSON.stringify(response.data, null, 4));
       return res.send(response.data);
    } catch (error) {
        return res.status(404).json({message: "Book not found or error fetching book by ISBN"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let matchingbooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
            matchingbooks[key] = books[key];
        }
    });

    if (Object.keys(matchingbooks).length > 0) {
        return res.send(JSON.stringify(matchingbooks, null, 4));
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let matchingbooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            matchingbooks[key] = books[key];
        }
    });

    if (Object.keys(matchingbooks).length > 0) {
        return res.send(JSON.stringify(matchingbooks, null, 4));
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

public_users.get('/test', function (req, res) {
    res.send("General router works");
});

module.exports.general = public_users;
