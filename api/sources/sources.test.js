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
  //wipes all tables in database clean so each test starts with empty tables and adds test data in to the incident and type of force tables
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

  describe('getSourcesByIncidentId(incident_id)', () => {
    it('gets single source for a particular incident id', async () => {
      let sources = getSources();
      let src = sources[0];

      await db('sources').insert(src);

      const source = await Sources.getSourcesByIncidentId(1);
      const dbSource = await db('sources');

      expect(source).toHaveLength(1);
      expect(source).toEqual(dbSource);
    });
    it('gets multiple sources with the same incident id', async () => {
      let sources = getSources();

      //populates source table so it's a non-empty table
      await asyncForEach(sources, async (source) => {
        await db('sources').insert(source);
      });

      //check that getting sources pertaining a particular incident based on incident id
      const incident1sources = await Sources.getSourcesByIncidentId(1);
      const incident2sources = await Sources.getSourcesByIncidentId(2);

      //checks that the array we are getting back has only 1 incident id related to the particular call
      expect(incident1sources).toHaveLength(2);
      incident1sources.forEach((source) => {
        expect(source.incident_id).toBe(1);
      });

      expect(incident2sources).toHaveLength(2);
      incident2sources.forEach((source) => {
        expect(source.incident_id).toBe(2);
      });
    });
  });

  describe('createSource(sources, incidentID)', () => {
    it('adds a source to an empty source table', async () => {
      let sources = getSources();
      let source1 = {
        src_url: sources[0].src_url,
        src_type: sources[0].src_type,
      };
      await Sources.createSource([source1], 1);

      const dbSources = await db('sources');
      expect(dbSources).toHaveLength(1);
    });

    it('adds a source to a non-empty source table', async () => {
      let sources = getSources();
      let sourceList = [sources[0], sources[1], sources[2]];

      await asyncForEach(sourceList, async (source) => {
        await db('sources').insert(source);
      });

      let src = { src_url: sources[3].src_url, src_type: sources[3].src_type };

      await Sources.createSource([src], 2);

      const dbSources = await db('sources');
      expect(dbSources).toHaveLength(4);
    });
  });
});
