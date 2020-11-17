/* eslint-disable */
const db = require('../../data/db-config');
const Tags = require('./tagsModel');

//returns an array of test type of forces
function getTags() {
  let tag1 = { type_of_force: 'projectile' };
  let tag2 = { type_of_force: 'hard' };
  let tag3 = { type_of_force: 'presence' };
  let tag4 = { type_of_force: 'other' };

  return [tag1, tag2, tag3, tag4];
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

describe('tagsModel', () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw('TRUNCATE TABLE incidents RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE sources RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE type_of_force RESTART IDENTITY CASCADE');
    await db.raw(
      'TRUNCATE TABLE incident_type_of_force RESTART IDENTITY CASCADE'
    );
    await db.raw('TRUNCATE TABLE incident_sources RESTART IDENTITY CASCADE');

    //inserts incidents into db
    await db('incidents').insert({
      state: 'Washington',
      city: 'Olympia',
      desc:
        'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
      title: 'Police respond to broken windows with excessive force',
      date: '2020-05-31',
      state_abbrev: 'WA',
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
      state_abbrev: 'WA',
      lat: 47.6211,
      long: -122.3244,
    });

    //inserts sources into database
    await db('sources').insert({
      src_url: 'url1',
      src_type: 'post',
    });

    await db('sources').insert({
      src_url: 'url2',
      src_type: 'video',
    });

    await db('sources').insert({
      src_url: 'url3',
      src_type: 'article',
    });

    //inserts relationship between sources and incidents
    await db('incident_sources').insert({ incident_id: 1, src_id: 1 });
    await db('incident_sources').insert({ incident_id: 1, src_id: 2 });
    await db('incident_sources').insert({ incident_id: 2, src_id: 3 });
  });

  describe('createTags(tags, incidentID)', () => {
    it('creates a tag in an empty type_of_force table', async () => {
      let tags = getTags();
      let tag = tags[0]['type_of_force'];

      await Tags.createTags(tag, 1);

      const dbTags = await db('type_of_force');
      expect(dbTags).toHaveLength(1);
      expect(dbTags[0]).toEqual({
        type_of_force_id: 1,
        type_of_force: 'projectile',
      });
    });

    it('creates a tag in a non-empty type_of_force table', async () => {
      const expectedTags = [
        { incident_id: 1, type_of_force: 'projectile', type_of_force_id: 1 },
        { incident_id: 1, type_of_force: 'hard', type_of_force_id: 2 },
        { incident_id: 2, type_of_force: 'presence', type_of_force_id: 3 },
        { incident_id: 2, type_of_force: 'other', type_of_force_id: 4 },
      ];

      let tags = getTags();
      const tagList = [tags[0], tags[1], tags[2]];

      await asyncForEach(tagList, async (tag) => {
        await db('type_of_force').insert(tag);
      });

      await db('incident_type_of_force').insert({
        type_of_force_id: 1,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 2,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 3,
        incident_id: 2,
      });

      let tagToInsert = tags[3]['type_of_force'];
      await Tags.createTags(tagToInsert, 2);

      const dbTags = await db('type_of_force as tof')
        .join(
          'incident_type_of_force as itof',
          'itof.type_of_force_id',
          'tof.type_of_force_id'
        )
        .join('incidents as i', 'i.incident_id', 'itof.incident_id')
        .select(
          'tof.type_of_force_id',
          'tof.type_of_force',
          'itof.incident_id'
        );

      expect(dbTags).toHaveLength(4);
      expect(dbTags).toEqual(expectedTags);
    });

    it('Does not add duplicate tags to the database', async () => {
      let tags = getTags();
      const tagList = [tags[0], tags[1], tags[2]];

      await asyncForEach(tagList, async (tag) => {
        await db('type_of_force').insert(tag);
      });

      await db('incident_type_of_force').insert({
        type_of_force_id: 1,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 2,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 3,
        incident_id: 2,
      });

      const tags1 = await db('type_of_force');

      await Tags.createTags('projectile', 1);
      const tags2 = await db('type_of_force');

      expect(tags1).toEqual(tags2);
    });

    it('Does add the new incident to type of force relationship', async () => {
      const expected = [
        { itof_id: 1, type_of_force_id: 1, incident_id: 1 },
        { itof_id: 2, type_of_force_id: 2, incident_id: 1 },
        { itof_id: 3, type_of_force_id: 3, incident_id: 2 },
        { itof_id: 4, type_of_force_id: 1, incident_id: 1 },
      ];

      let tags = getTags();
      const tagList = [tags[0], tags[1], tags[2]];

      await asyncForEach(tagList, async (tag) => {
        await db('type_of_force').insert(tag);
      });

      await db('incident_type_of_force').insert({
        type_of_force_id: 1,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 2,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 3,
        incident_id: 2,
      });

      await Tags.createTags('projectile', 1);
      const incidentTypes = await db('incident_type_of_force');

      expect(incidentTypes).toEqual(expected);
    });
  });

  describe('getAllTags()', () => {
    it('gets all tags from the tag table', async () => {
      let tags = getTags();

      await asyncForEach(tags, async (tag) => {
        await db('type_of_force').insert(tag);
      });

      await db('incident_type_of_force').insert({
        type_of_force_id: 1,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 2,
        incident_id: 1,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 3,
        incident_id: 2,
      });
      await db('incident_type_of_force').insert({
        type_of_force_id: 4,
        incident_id: 2,
      });

      const dbTags = await db('type_of_force as tof')
        .join(
          'incident_type_of_force as itof',
          'itof.type_of_force_id',
          'tof.type_of_force_id'
        )
        .join('incidents as i', 'i.incident_id', 'itof.incident_id')
        .select(
          'tof.type_of_force_id',
          'tof.type_of_force',
          'itof.incident_id'
        );
      const modelTags = await Tags.getAllTags();

      expect(modelTags).toHaveLength(4);
      expect(modelTags).toEqual(dbTags);
    });
  });
});
