/* eslint-disable */
const db = require('../../data/db-config');
const Sources = require('./sourcesModel');

describe('sourcesModel', () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw('TRUNCATE TABLE incidents RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE sources RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE type_of_force RESTART IDENTITY CASCADE');
  });

  describe('getAllSources()', () => {
    it('gets a single source from an empty database ', async () => {
      await db('sources').insert({
        incident_id: 1,
        src_url: 'something.com',
        src_type: 'post',
      });

      const sources = await Sources.getAllSources();

      expect(sources).toHaveLength(1);
    });
  });
});
