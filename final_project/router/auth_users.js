const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
        let filteredUsers = users.filter((user) => {
            return user.username === username;
        });
        return filteredUsers.length > 0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    return validUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || ! password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign(
        {data: username},
        "access",
        {expiresIn: 60 *60}
    );

    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(403).json({message: "Invalid username or password"});
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(400).json({message: "Book not found"});
    }

    if (!review) {
        return res.status(400).json({message: "Review is required"});
    }

    books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} has been added/updated`,
    reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
