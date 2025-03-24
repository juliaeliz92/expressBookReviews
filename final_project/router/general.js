const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getBooks = new Promise((resolve, rej) => {
    resolve(res.status(200).json(books))
  })
  getBooks.then(() => console.log('book list returned'))
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params
  const getBooks = new Promise((resolve, rej) => {
    const bookResult = books[isbn]
    if(bookResult)
      resolve(res.status(200).json(bookResult))
    else
      rej(res.status(404).send('no book found!'))
  })

  getBooks.then(() => console.log('book list returned'))
  
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params

  const getBooks = new Promise((resolve, rej) => {
    let bookResult;
    for(let book in books) {
      if(books[book].author === author)
        bookResult = books[book]
    }
    if(bookResult) {
      resolve(res.status(200).json(bookResult))
    } else
      rej(res.status(404).json({message: "No book found!"}))
    })

    getBooks.then(() => console.log('book list returned'))

});

// task 12
// const bookResult3 = axios.get('/author/Chinua Achebe').then(data => data).catch(err => console.error(err))

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params

  const getBooks = new Promise((resolve, rej) => {
    let bookResult;
    for(let book in books) {
      if(books[book].title === title)
        bookResult = books[book]
    }
    if(bookResult) {
      resolve(res.status(200).json(bookResult))
    } else
      rej(res.status(404).json({message: "No book found!"}))
    })

    getBooks.then(() => console.log('book list returned'))

});

// Task 13
// const bookResult4 = axios.get('/title/Chinua Achebe').then(data => data).catch(err => console.error(err))


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params
  if(books[isbn]) {
    return res.status(200).json({review: books[isbn].review});
  } else
    return res.status(404).json({message: "No book found!"});
});

module.exports.general = public_users;
