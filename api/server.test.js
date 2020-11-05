/* eslint-disable */
const supertest = require('supertest');
const server = require('./app');
const db = require('../data/db-config');

//expected incidents from database
const expected = [
  {
    incident_id: 1,
    state: 'Washington',
    city: 'Olympia',
    desc:
      'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
    title: 'Police respond to broken windows with excessive force',
    date: '2020-05-31T04:00:00.000Z',
    id: 'wa-olympia-1',
    lat: 47.0417,
    long: -122.8959,
    src: [
      { src_id: 1, incident_id: 1, src_url: 'url1', src_type: 'post' },
      { src_id: 2, incident_id: 1, src_url: 'url2', src_type: 'video' },
    ],
    categories: ['projectiles'],
  },
  {
    incident_id: 2,
    state: 'Washington',
    city: 'Seattle',
    desc:
      'Officer pins protester with his knee on his neck. His partner intervenes and moves his knee onto the individual\'s back.\n\nPossibly related to OPD Case 2020OPA-0324 - "Placing the knee on the neck area of two people who had been arrested"',
    title: 'Officer pins protester by pushing his knee into his neck',
    date: '2020-05-30T04:00:00.000Z',
    id: 'wa-seattle-1',
    lat: 47.6211,
    long: -122.3244,
    src: [
      {
        src_id: 3,
        incident_id: 2,
        src_url: 'url3',
        src_type: 'article',
      },
    ],
    categories: ['presence'],
  },
];

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

        expect(res.body).toEqual(expected);
      });

      it('returns 200 OK', async () => {
        const res = await supertest(server).get('/incidents/showallincidents');
        expect(res.status).toBe(200);
      });
    });

    describe('POST /createincidents', () => {
      it('returns 201 when adding a new incident', async () => {
        const newIncident = {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'A sheriff throws a canister of tear gas into a crowd of peaceful protesters.',
          title: 'Police throw tear gas at peaceful protesters',
          date: '2020-05-31',
          id: 'wa-seattle-8',
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
          state: 'Washington',
          city: 'Seattle',
          desc:
            'A sheriff throws a canister of tear gas into a crowd of peaceful protesters.',
          title: 'Police throw tear gas at peaceful protesters',
          date: '2020-05-31',
          id: 'wa-seattle-8',
          lat: 47.6211,
          long: -122.3244,
          src: [{ src_url: 'url4', src_type: 'video' }],
          tags: ['chemical', 'projectiles'],
        };

        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send([newIncident]);

        newIncident.incident_id = 3;

        expect(res.body.message).toEqual('Success!');
      });

      it('returns "Error creating Record" when it can not add the record to the database', async () => {
        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send();

        expect(res.body.message).toBe('Error creating Record');
      });

      it('returns 500 Error when it can not add a record to the database', async () => {
        const res = await supertest(server)
          .post('/incidents/createincidents')
          .send();

        expect(res.status).toBe(500);
      });
    });
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
    });
    describe('GET /sources/:incidentID', () => {
      it('returns 200 OK', async () => {
        const res = await supertest(server).get('/incidents/sources/2');
        expect(res.status).toBe(200);
      });

      it('returns a list of sources for the given incident id in the url', async () => {
        const src1 = [
          { src_id: 1, incident_id: 1, src_url: 'url1', src_type: 'post' },
          { src_id: 2, incident_id: 1, src_url: 'url2', src_type: 'video' },
        ];

        const src2 = [
          { src_id: 3, incident_id: 2, src_url: 'url3', src_type: 'article' },
        ];

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
    });

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

      it('returns message requesting source information if not provided', async () => {
        const res = await supertest(server)
          .post('/incidents/createsource')
          .send();
        expect(res.body.message).toBe(
          'Missing incident id, source url or source type'
        );
      });

      it('returns 400 status when source information is not provided', async () => {
        const res = await supertest(server)
          .post('/incidents/createsource')
          .send();
        expect(res.status).toBe(400);
      });
    });

    describe('GET /tags', () => {}); //end get /tags describe
  }); //end /incidents Router
}); //end server
