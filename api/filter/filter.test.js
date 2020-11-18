/* eslint-disable */
const db = require('../../data/db-config');
const Filter = require('./filterModel');

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
  // wipes all tables in database clean so each test starts with empty tables
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
      state_abbrev: 'WA',
      desc:
        'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
      title: 'Police respond to broken windows with excessive force',
      date: '2020-05-31',
      lat: 47.0417,
      long: -122.8959,
    });

    await db('incidents').insert({
      state: 'Washington',
      city: 'Seattle',
      state_abbrev: 'WA',
      desc:
        'Officer pins protester with his knee on his neck. His partner intervenes and moves his knee onto the individual\'s back.\n\nPossibly related to OPD Case 2020OPA-0324 - "Placing the knee on the neck area of two people who had been arrested"',
      title: 'Officer pins protester by pushing his knee into his neck',
      date: '2020-05-30',
      lat: 47.6211,
      long: -122.3244,
    });

    //inserts type of force into database
    await db('type_of_force').insert({
      type_of_force: 'projectiles',
    });

    await db('type_of_force').insert({
      type_of_force: 'presence',
    });

    //inserts incident type of force relationship
    await db('incident_type_of_force').insert({
      incident_id: 1,
      type_of_force_id: 1,
    });

    await db('incident_type_of_force').insert({
      incident_id: 2,
      type_of_force_id: 2,
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

    //inserts source and incident relationships
    await db('incident_sources').insert({
      incident_id: 1,
      src_id: 1,
    });
    await db('incident_sources').insert({
      incident_id: 1,
      src_id: 2,
    });
    await db('incident_sources').insert({
      incident_id: 2,
      src_id: 3,
    });
  }); //end before each

  it('getting count of each different type of force that has 1 instance', async () => {
    const count = await Filter.getCountTags();
    expect(count).toHaveLength(2);
    expect(count).toEqual([
      { count: '1', type_of_force: 'projectiles' },
      { count: '1', type_of_force: 'presence' },
    ]);
  });

  it('getting count of each different type of force where the counts are different', async () => {
    await db('incidents').insert({
      state: 'Washington',
      city: 'Seattle',
      state_abbrev: 'WA',
      desc: 'Some description',
      title: 'Some title',
      date: '2020-05-30',
      lat: 47.6,
      long: -122.3,
    });
    await db('incident_type_of_force').insert({
      incident_id: 3,
      type_of_force_id: 1,
    });
    const count = await Filter.getCountTags();
    expect(count).toHaveLength(2);
    expect(count).toEqual([
      { count: '2', type_of_force: 'projectiles' },
      { count: '1', type_of_force: 'presence' },
    ]);
  });
});
