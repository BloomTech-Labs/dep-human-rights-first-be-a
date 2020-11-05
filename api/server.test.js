/* eslint-disable */
const supertest = require('supertest');
const server = require('./app');
const db = require('../data/db-config');
const { internet } = require('faker');

describe('server', () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw('TRUNCATE TABLE incidents RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE sources RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE type_of_force RESTART IDENTITY CASCADE');
  });

  describe('GET / for indexRouter', () => {
    it('returns 200 OK', async () => {
      const res = await supertest(server).get('/');
      expect(res.status).toBe(200);
    });

    it('returns Hello World message with current time', async () => {
      const res = await supertest(server).get('/');
      expect(res.body).toEqual({ api: 'Hello World' });
    });
  });
});
