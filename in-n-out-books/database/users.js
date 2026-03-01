/**
 * Author: Professor Krasso
 * Date: 4/1/2024
 * File Name: users.js
 * Description: Users collection file for the in-n-out-books application; used to store user data
 */

const bcrypt = require('bcryptjs');
const Collection = require('./collection');

const saltRounds = 10;

const users = new Collection([
  {
    id: 1,
    email: 'harry@hogwarts.edu',
    password: bcrypt.hashSync('potter', saltRounds),
    securityQuestions: [
      { question: "What is your pet's name?", answer: 'Hedwig' },
      { question: "What is your favorite book?", answer: 'Quidditch Through the Ages' },
      { question: "What is your mother's maiden name?", answer: 'Evans' },
    ],
  },
  {
    id: 2,
    email: 'hermione@hogwarts.edu',
    password: bcrypt.hashSync('granger', saltRounds),
    securityQuestions: [
      { question: "What is your pet's name?", answer: 'Crookshanks' },
      { question: "What is your favorite book?", answer: 'Hogwarts: A History' },
      { question: "What is your mother's maiden name?", answer: 'Wilkins' },
    ],
  },
  {
    id: 3,
    email: 'ron@hogwarts.edu',
    password: bcrypt.hashSync('weasley', saltRounds),
    securityQuestions: [
      { question: "What is your pet's name?", answer: 'Scabbers' },
      { question: "What is your favorite book?", answer: 'The Quibbler' },
      { question: "What is your mother's maiden name?", answer: 'Prewett' },
    ],
  },
]);

module.exports = users;
