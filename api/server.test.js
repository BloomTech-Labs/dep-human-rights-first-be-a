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

    //inserts incidents into db
    await db('incidents').insert({
      state: 'Washington',
      city: 'Olympia',
      desc:
        'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
      title: 'Police respond to broken windows with excessive force',
      date: '2020-05-31',
      id: 'wa-olympia-1',
      lat: 47.0417,
      long: -122.8959,
    });

    await db('incidents').insert({
      state: 'Washington',
      city: 'Seattle',
      desc:
        'Officer pins protester with his knee on his neck. His partner intervenes and moves his knee onto the individual\'s back.\n\nPossibly related to OPD Case 2020OPA-0324 - "Placing the knee on the neck area of two people who had been arrested"',
      title: 'Officer pins protester by pushing his knee into his neck',
      date: '2020-05-30',
      id: 'wa-seattle-1',
      lat: 47.6211,
      long: -122.3244,
    });

    //inserts type of force into database
    await db('type_of_force').insert({
      type_of_force: 'projectiles',
      incident_id: 1,
    });

    await db('type_of_force').insert({
      type_of_force: 'presence',
      incident_id: 2,
    });

    //inserts sources into database
    await db('sources').insert({
      incident_id: 1,
      src_url: 'url1',
      src_type: 'post',
    });

    await db('sources').insert({
      incident_id: 1,
      src_url: 'url2',
      src_type: 'video',
    });

    await db('sources').insert({
      incident_id: 2,
      src_url: 'url3',
      src_type: 'article',
    });
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

  describe('/incidentsRouter', () => {
    describe('GET /showallincidents', () => {
      it('returns list of incidents', async () => {
        const res = await supertest(server).get('/incidents/showallincidents');
        expect(res.status).toBe(200);
      });
    });
  });
});
