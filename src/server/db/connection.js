/*
This file connects to the database using the appropriate Knex configuration based on the environment (development, test, staging, production, etc.)
*/
const environment = 'test'; // alt environment: 'test' or 'development'
// const environment = process.env.NODE_ENV || 'development';
const config = require('../../../knexfile.js')[environment];

module.exports = require('knex')(config);