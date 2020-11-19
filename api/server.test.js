/* eslint-disable */
const supertest = require('supertest');
const server = require('./app');
const db = require('../data/db-config');

//expected incidents from database
const expected = [
  {
    incident_id: 1,
    state: 'Washington',
    state_abbrev: 'WA',
    city: 'Olympia',
    desc:
      'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
    title: 'Police respond to broken windows with excessive force',
    date: '2020-05-31T04:00:00.000Z',
    lat: 47.0417,
    long: -122.8959,
    src: [
      { src_id: 1, src_url: 'url1', src_type: 'post' },
      { src_id: 2, src_url: 'url2', src_type: 'video' },
    ],
    categories: [
      {
        incident_id: 1,
        type_of_force: 'projectiles',
        type_of_force_id: 1,
      },
    ],
  },
  {
    incident_id: 2,
    state: 'Washington',
    state_abbrev: 'WA',
    city: 'Seattle',
    desc:
      'Officer pins protester with his knee on his neck. His partner intervenes and moves his knee onto the individual\'s back.\n\nPossibly related to OPD Case 2020OPA-0324 - "Placing the knee on the neck area of two people who had been arrested"',
    title: 'Officer pins protester by pushing his knee into his neck',
    date: '2020-05-30T04:00:00.000Z',
    lat: 47.6211,
    long: -122.3244,
    src: [
      {
        src_id: 3,
        src_url: 'url3',
        src_type: 'article',
      },
    ],
    categories: [
      { incident_id: 2, type_of_force: 'presence', type_of_force_id: 2 },
    ],
  },
];

describe('server', () => {
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
      state_abbrev: 'WA',
      city: 'Olympia',
      desc:
        'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
      title: 'Police respond to broken windows with excessive force',
      date: '2020-05-31',
      lat: 47.0417,
      long: -122.8959,
    });

    await db('incidents').insert({
      state: 'Washington',
      state_abbrev: 'WA',
      city: 'Seattle',
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
    await db('incident_sources').insert({ incident_id: 1, src_id: 1 });
    await db('incident_sources').insert({ incident_id: 1, src_id: 2 });
    await db('incident_sources').insert({ incident_id: 2, src_id: 3 });
  }); //end beforeEach

  describe('GET / for indexRouter', () => {
    it('returns 200 OK', async () => {
      const res = await supertest(server).get('/');
      expect(res.status).toBe(200);
    });

    it('returns Hello World message with current time', async () => {
      const res = await supertest(server).get('/');
      expect(res.body).toEqual({ api: 'Hello World' });
    });
  }); //end get / for indexRouter

  describe('/incidentsRouter', () => {
    describe('GET /showallincidents', () => {
      it('returns list of incidents', async () => {
        const res = await supertest(server).get('/incidents/showallincidents');
        expect(res.body.incidents).toEqual(expected);
      });

      it('returns 200 OK', async () => {
        const res = await supertest(server).get('/incidents/showallincidents');
        expect(res.status).toBe(200);
      });
    }); //end get /showallincidents

    describe('POST /createincidents', () => {
      it('returns 201 when adding a new incident', async () => {
        const newIncident = {
          state: 'New York',
          city: 'New York',
          state_abbrev: 'NY',
          desc: 'Some description',
          title: 'Some title',
          date: '2020-11-08',
          lat: 47.6211,
          long: -122.3244,
          src: [{ src_url: 'url4', src_type: 'video' }],
          tags: ['chemical', 'projectiles'],
        };

        let dbIncidents = await db('incidents');
        expect(dbIncidents).toHaveLength(2);

        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send([newIncident]);

        dbIncidents = await db('incidents');

        expect(res.status).toBe(201);
        expect(dbIncidents).toHaveLength(3);
        expect(dbIncidents[2].desc).toEqual(newIncident.desc);
      });

      it('returns success message when successfully adding incident', async () => {
        const newIncident = {
          state: 'New York',
          city: 'New York',
          state_abbrev: 'NY',
          desc: 'Some description',
          title: 'Some title',
          date: '2020-11-08',
          lat: 47.6211,
          long: -122.3244,
          src: [{ src_url: 'url4', src_type: 'video' }],
          tags: ['chemical', 'projectiles'],
        };

        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send([newIncident]);

        expect(res.body.message).toEqual('Success!');
        expect(res.body.incident_id).toEqual([3]);
      });

      it('returns "Error creating Record" when it can not add the record to the database', async () => {
        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send([]);

        expect(res.body.message).toBe('Error creating incident');
      });

      it('returns 500 Error when it can not add a record to the database', async () => {
        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send();

        expect(res.status).toBe(500);
      });
    }); //end post /createincidents

    describe('GET /sources', () => {
      it('returns 200 OK', async () => {
        const res = await supertest(server).get('/incidents/sources');
        expect(res.status).toBe(200);
      });

      it('returns list of all sources in database', async () => {
        const res = await supertest(server).get('/incidents/sources');

        const sources = [
          { src_id: 1, incident_id: 1, src_url: 'url1', src_type: 'post' },
          { src_id: 2, incident_id: 1, src_url: 'url2', src_type: 'video' },
          { src_id: 3, incident_id: 2, src_url: 'url3', src_type: 'article' },
        ];

        expect(res.body).toEqual(sources);
      });
    }); //end get /sources

    describe('GET /sources/:incidentID', () => {
      it('returns 200 OK', async () => {
        const res = await supertest(server).get('/incidents/sources/2');
        expect(res.status).toBe(200);
      });

      it('returns a list of sources for the given incident id in the url', async () => {
        const src1 = [
          { src_id: 1, src_url: 'url1', src_type: 'post' },
          { src_id: 2, src_url: 'url2', src_type: 'video' },
        ];

        const src2 = [{ src_id: 3, src_url: 'url3', src_type: 'article' }];

        const res = await supertest(server).get('/incidents/sources/1');
        expect(res.body).toEqual(src1);

        const res2 = await supertest(server).get('/incidents/sources/2');
        expect(res2.body).toEqual(src2);
      });

      it('returns empty array when given incident id that does not exist in database', async () => {
        const res = await supertest(server).get('/incidents/sources/5');
        expect(res.body).toHaveLength(0);
      });

      it('returns 200 OK when given incident id that does not exist in database', async () => {
        const res = await supertest(server).get('/incidents/sources/5');
        expect(res.status).toBe(200);
      });
    }); //end sources/inicidentID

    describe('POST /createsource ', () => {
      it('adds a source to the database', async () => {
        let src = { incident_id: 2, src_url: 'url4', src_type: 'article' };

        const res = await supertest(server)
          .post('/incidents/createsource')
          .send(src);

        expect(res.status).toBe(201);
      });

      it('returns Success message after successfully adding source to the database', async () => {
        let src = {
          incident_id: 2,
          src_url: 'url4',
          src_type: 'article',
        };

        const res = await supertest(server)
          .post('/incidents/createsource')
          .send(src);

        expect(res.body.message).toBe('Success!');
      });

      it('returns 201 after adding a source to the datavase', async () => {
        let src = {
          incident_id: 2,
          src_url: 'url4',
          src_type: 'article',
        };

        const res = await supertest(server)
          .post('/incidents/createsource')
          .send(src);
        expect(res.status).toBe(201);
      });

      it('returns error message when source information is not provided', async () => {
        const res = await supertest(server)
          .post('/incidents/createsource')
          .send();
        expect(res.body.message).toBe('Error creating source');
      });

      it('returns 500 status when source information is not provided', async () => {
        const res = await supertest(server)
          .post('/incidents/createsource')
          .send();
        expect(res.status).toBe(500);
      });
    }); //end post /createsource

    describe('GET /tags', () => {
      it('sends 200 OK when retrieving tags', async () => {
        const res = await supertest(server).get('/incidents/tags');

        expect(res.status).toBe(200);
      });

      it('returns a list of all tags in the database', async () => {
        const tags = [
          { type_of_force_id: 1, type_of_force: 'projectiles', incident_id: 1 },
          { type_of_force_id: 2, type_of_force: 'presence', incident_id: 2 },
        ];

        const res = await supertest(server).get('/incidents/tags');

        expect(res.body).toEqual(tags);
      });
    }); //end get /tags describe

    describe('GET /tags/:incidentID', () => {
      it('returns 200 OK when returning tags for a particular incident', async () => {
        const res = await supertest(server).get('/incidents/tags/1');

        expect(res.status).toBe(200);
      });

      it('returns list of all tags for a particular incident id in the url', async () => {
        const expected = [
          {
            type_of_force_id: 1,
            type_of_force: 'projectiles',
            incident_id: 1,
          },
        ];

        const res = await supertest(server).get('/incidents/tags/1');

        expect(res.body).toEqual(expected);
      });

      it('returns empty array when trying to get tags for an incident that does not exist in database', async () => {
        const res = await supertest(server).get('/incidents/tags/5');

        expect(res.body).toEqual([]);
        expect(res.body).toHaveLength(0);
      });

      it('returns 200 OK when trying to get tags for an incident that does not exist in database', async () => {
        const res = await supertest(server).get('/incidents/tags/5');

        expect(res.status).toBe(200);
      });
    }); //end get /tags/:incidentID
  }); //end /incidents Router

  describe('/filterRouter', () => {
    it('returns 200 OK when returning data', async () => {
      const res = await supertest(server).get('/filter/forceCounts');
      expect(res.status).toBe(200);
    });

    it('returns expected output', async () => {
      const res = await supertest(server).get('/filter/forceCounts');
      const filter = await db('type_of_force as tof')
        .join(
          'incident_type_of_force as itof',
          'itof.type_of_force_id',
          'tof.type_of_force_id'
        )
        .count('tof.type_of_force_id')
        .groupBy('type_of_force')
        .select('tof.type_of_force')
        .orderBy('count', 'desc');

      expect(res.body.data).toEqual(filter);
      expect(res.body.data.length).toBe(2);
    });

    it('empty array when no data available', async () => {
      await db.raw('TRUNCATE TABLE incidents RESTART IDENTITY CASCADE');
      await db.raw('TRUNCATE TABLE sources RESTART IDENTITY CASCADE');
      await db.raw('TRUNCATE TABLE type_of_force RESTART IDENTITY CASCADE');
      await db.raw(
        'TRUNCATE TABLE incident_type_of_force RESTART IDENTITY CASCADE'
      );
      await db.raw('TRUNCATE TABLE incident_sources RESTART IDENTITY CASCADE');

      const res = await supertest(server).get('/filter/forceCounts');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.data).toEqual([]);
    });
  });
}); //end server
