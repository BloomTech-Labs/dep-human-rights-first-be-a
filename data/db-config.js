require('dotenv').config();
const knex = require('knex');
const dbEnvironment = process.env.NODE_ENV || 'testing';
const knexConfig = require('../config/knexfile')[dbEnvironment];
module.exports = knex(knexConfig);
