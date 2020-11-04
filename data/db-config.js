require('dotenv').config();
const knex = require('knex');
const dbEnvironment = process.env.NODE_ENV || 'test';
const knexConfig = require('../config/knexfile')[dbEnvironment];
module.exports = knex(knexConfig);
