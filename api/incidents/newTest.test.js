/* eslint-disable */
const db = require('../../data/db-config');
const Incidents = require('./incidentsModel');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');
const Middleware = require('../incidents/middleware/index');

//test constants

const testIncidents = require('./constants/testConstants');
//only valid incident in Incidents array is at index 0
const incidentsTocheck = testIncidents.Incidents;

const incident_sample = {
  title: 'A',
  desc: 'A',
  city: 'A',
  state: 'A',
  lat: '0',
  long: '0',
  date: '1800-01-01',
};

describe('showAllIncidents', () => {
  it('works', async () => {
    const incidents = await Incidents.showAllIncidents(5, 0);

    for (let i = 0; i < incidents.length; i++) {
      id = incidents[i].incident_id;

      let sources = await Sources.getSourcesByIncidentId(id);

      let tags = await Tags.getTagsByIncidentId(id);

      incidents[i]['src'] = sources;
      incidents[i]['categories'] = tags;
    }
    // console.log(incidents);
  });
});

describe('createIncident', () => {
  //   it('returns if incident is in db already or not', async () => {
  //     const i = await db('incidents').limit(10);

  //     await Incidents.checkIncidentExists(i[0]).then((res) => {
  //       if (res.length > 0) {
  //         console.log('in db');
  //       } else {
  //         console.log('no');
  //       }
  //     });

  //     await Incidents.checkIncidentExists(incident_sample).then((res) => {
  //       if (res.length > 0) {
  //         console.log('in db');
  //       } else {
  //         console.log('no');
  //       }
  //     });
  //   });

  it('returns valid when object has all required keys and they are not null or undefined or an empty string', async () => {
    expect(Middleware.validateIncidents(incidentsTocheck[0])).toBe(true);
  });

  it('returns error when object has src key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[1])).toBe(false);
  });

  it('returns error when object has state key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[2])).toBe(false);
  });

  it('returns error when object has city key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[3])).toBe(false);
  });

  it('returns error when object has desc key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[4])).toBe(false);
  });

  it('returns error when object has tags key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[5])).toBe(false);
  });

  it('returns error when object has title key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[6])).toBe(false);
  });

  it('returns error when object has date key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[7])).toBe(false);
  });

  it('returns error when object has lat key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[8])).toBe(false);
  });

  it('returns error when object has long key missing', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[9])).toBe(false);
  });

  it('returns error when object has keys but no values', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[10])).toBe(false);
  });

  it('returns error is object is empty of keys and values', () => {
    expect(Middleware.validateIncidents(incidentsTocheck[11])).toBe(false);
  });
});

describe('processSources', () => {
  it('processes source array correctly', async () => {
    const i1 = incidentsTocheck[0];
    const sourceP = Middleware.processSources(i1.src);
    expect(sourceP[0].src_url).toBe(
      'https://www.youtube.com/watch?v=s7MM1VauRHo'
    );
    expect(sourceP[0].src_type).toBe('video');
  });
});

describe('getStateAbbrev', () => {
  it('gets state abbreviation', () => {
    const i1 = incidentsTocheck[0];
    const abbrev = Middleware.getStateAbbrev(i1.state);
    expect(abbrev).toBe('OR');
  });
});
