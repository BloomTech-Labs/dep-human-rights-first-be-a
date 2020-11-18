/* eslint-disable */
const db = require('../../data/db-config');
const Incidents = require('./incidentsModel');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');
const Middleware = require('./middleware/index');

//test constants
const testIncidents = require('./constants/testConstants');
//only valid incident in Incidents array is at index 0
const incidentsTocheck = testIncidents.Incidents;

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
  });
});

describe('validateIncidents', () => {
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
  it('gets Arizona state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Arizona');
    expect(abbrev).toBe('AZ');
  });

  it('gets Alabama state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Alabama');
    expect(abbrev).toBe('AL');
  });

  it('gets Alaska state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Alaska');
    expect(abbrev).toBe('AK');
  });

  it('gets Arkansas state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Arkansas');
    expect(abbrev).toBe('AR');
  });

  it('gets California state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('California');
    expect(abbrev).toBe('CA');
  });

  it('gets Colorado state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Colorado');
    expect(abbrev).toBe('CO');
  });

  it('gets Connecticut state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Connecticut');
    expect(abbrev).toBe('CT');
  });

  it('gets Delaware state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Delaware');
    expect(abbrev).toBe('DE');
  });

  it('gets Florida state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Florida');
    expect(abbrev).toBe('FL');
  });

  it('gets Georgia state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Georgia');
    expect(abbrev).toBe('GA');
  });

  it('gets Hawaii state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Hawaii');
    expect(abbrev).toBe('HI');
  });

  it('gets Idaho state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Idaho');
    expect(abbrev).toBe('ID');
  });

  it('gets Illinois state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Illinois');
    expect(abbrev).toBe('IL');
  });

  it('gets Indiana state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Indiana');
    expect(abbrev).toBe('IN');
  });

  it('gets Iowa state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Iowa');
    expect(abbrev).toBe('IA');
  });

  it('gets Kansas state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Kansas');
    expect(abbrev).toBe('KS');
  });

  it('gets Kentucky state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Kentucky');
    expect(abbrev).toBe('KY');
  });

  it('gets Louisiana state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Louisiana');
    expect(abbrev).toBe('LA');
  });

  it('gets Maine state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Maine');
    expect(abbrev).toBe('ME');
  });

  it('gets Maryland state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Maryland');
    expect(abbrev).toBe('MD');
  });

  it('gets Massachusetts state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Massachusetts');
    expect(abbrev).toBe('MA');
  });

  it('gets Michigan state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Michigan');
    expect(abbrev).toBe('MI');
  });

  it('gets Minnesota state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Minnesota');
    expect(abbrev).toBe('MN');
  });

  it('gets Mississippi state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Mississippi');
    expect(abbrev).toBe('MS');
  });

  it('gets Missouri state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Missouri');
    expect(abbrev).toBe('MO');
  });

  it('gets Montana state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Montana');
    expect(abbrev).toBe('MT');
  });

  it('gets Nebraska state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Nebraska');
    expect(abbrev).toBe('NE');
  });

  it('gets Nevada state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Nevada');
    expect(abbrev).toBe('NV');
  });

  it('gets New Hampshire state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('New Hampshire');
    expect(abbrev).toBe('NH');
  });

  it('gets New Jersey state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('New Jersey');
    expect(abbrev).toBe('NJ');
  });

  it('gets New Mexico state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('New Mexico');
    expect(abbrev).toBe('NM');
  });

  it('gets New York state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('New York');
    expect(abbrev).toBe('NY');
  });

  it('gets North Carolina state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('North Carolina');
    expect(abbrev).toBe('NC');
  });

  it('gets North Dakota state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('North Dakota');
    expect(abbrev).toBe('ND');
  });

  it('gets Ohio state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Ohio');
    expect(abbrev).toBe('OH');
  });

  it('gets Oklahoma state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Oklahoma');
    expect(abbrev).toBe('OK');
  });

  it('gets Oregon state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Oregon');
    expect(abbrev).toBe('OR');
  });

  it('gets Pennsylvania state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Pennsylvania');
    expect(abbrev).toBe('PA');
  });

  it('gets Rhode Island state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Rhode Island');
    expect(abbrev).toBe('RI');
  });

  it('gets South Carolina state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('South Carolina');
    expect(abbrev).toBe('SC');
  });

  it('gets South Dakota state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('South Dakota');
    expect(abbrev).toBe('SD');
  });

  it('gets Tennessee state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Tennessee');
    expect(abbrev).toBe('TN');
  });

  it('gets Texas state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Texas');
    expect(abbrev).toBe('TX');
  });

  it('gets Utah state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Utah');
    expect(abbrev).toBe('UT');
  });

  it('gets Vermont state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Vermont');
    expect(abbrev).toBe('VT');
  });

  it('gets Virginia state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Virginia');
    expect(abbrev).toBe('VA');
  });

  it('gets Washington state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Washington');
    expect(abbrev).toBe('WA');
  });

  it('gets West Virginia state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('West Virginia');
    expect(abbrev).toBe('WV');
  });

  it('gets Wisconsin state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Wisconsin');
    expect(abbrev).toBe('WI');
  });

  it('gets Wyoming state abbreviation', () => {
    const abbrev = Middleware.getStateAbbrev('Wyoming');
    expect(abbrev).toBe('WY');
  });

  it('returns false when state does not match the state in the list', () => {
    const abbrev = Middleware.getStateAbbrev('wyoming');
    expect(abbrev).toBe(false);
  });
});
