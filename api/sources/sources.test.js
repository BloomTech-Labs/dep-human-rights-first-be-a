/* eslint-disable */
const db = require('../../data/db-config');
const Sources = require('./sourcesModel');

//returns an array of dummy sources to use for testing
function getSources() {
  let src1 = { incident_id: 1, src_url: 'url1', src_type: 'post' };
  let src2 = { incident_id: 1, src_url: 'url2', src_type: 'video' };
  let src3 = { incident_id: 2, src_url: 'url3', src_type: 'video' };
  let src4 = { incident_id: 2, src_url: 'url4', src_type: 'article' };

  return [src1, src2, src3, src4];
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

describe('sourcesModel', () => {
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

    it('gets all sources from a non-empty database', async () => {
      let sources = getSources();

      await asyncForEach(sources, async (source) => {
        await db('sources').insert(source);
      });

      const sourcesFromModel = await Sources.getAllSources();
      const dbSources = await db('sources');

      expect(sourcesFromModel).toHaveLength(4);
      expect(sourcesFromModel).toEqual(dbSources);
    });
  });
});
