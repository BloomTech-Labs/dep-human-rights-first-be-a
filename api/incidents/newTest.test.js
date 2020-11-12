/* eslint-disable */
const db = require('../../data/db-config');
const Incidents = require('./incidentsModel');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');

const incident_sample = {
  title: 'A',
  desc: 'A',
  city: 'A',
  state: 'A',
  lat: '0',
  long: '0',
  date: '1800-01-01',
};

const dsIncident = {
  src: ['https://www.youtube.com/watch?v=s7MM1VauRHo'],
  state: 'Oregon',
  city: 'Portland',
  desc:
    'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.  Police then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.  Police fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.  After police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.  A racial slur can be heard shouted, although it is unsure who is shouting.',
  tags: [
    'arrest',
    'less-lethal',
    'projectile',
    'protester',
    'shoot',
    'tear-gas',
  ],
  geolocation: "{'lat': '47.0378741', 'long': '-122.9006951'}",
  title: 'Police respond to broken windows with excessive force',
  date: '2020-05-31',
  date_text: 'May 31st',
  id: 'wa-olympia-1',
  lat: 47.0378741,
  long: -122.9006951,
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
    console.log(incidents);
  });
});

describe('createIncident', () => {
  it('returns if incident is in db already or not', async () => {
    const i = await db('incidents').limit(10);

    await Incidents.checkIncidentExists(i[0]).then((res) => {
      if (res.length > 0) {
        console.log('in db');
      } else {
        console.log('no');
      }
    });

    await Incidents.checkIncidentExists(incident_sample).then((res) => {
      if (res.length > 0) {
        console.log('in db');
      } else {
        console.log('no');
      }
    });
  });

  it.only('works', async () => {
    const i = await db('incidents').limit(10);

    await Incidents.checkIncidentExists(i[0]).then((res) => {
      if (res.length > 0) {
        console.log('in db');
      } else {
        console.log('no');
      }
    });

    await Incidents.checkIncidentExists(dsIncident).then((res) => {
      if (res.length > 0) {
        console.log('in db');
      } else {
        if (dsIncident.city === null && typeof dsIncident.city !== 'string') {
          console.log('city');
          return 'City not valid';
        } else if (dsIncident.state && typeof dsIncident.state !== 'string') {
          console.log('state');
          return 'State not valid';
        } else if (dsIncident.lat && typeof dsIncident.lat !== 'number') {
          console.log('lat');
          return 'Lat not valid';
        } else if (dsIncident.long && typeof dsIncident.long !== 'number') {
          console.log('long', typeof dsIncident.long);
          return 'Long not valid';
        } else if (dsIncident.title && typeof dsIncident.title !== 'string') {
          console.log('title');
          return 'title not valid';
        } else if (dsIncident.desc && typeof dsIncident.desc !== 'string') {
          console.log('desc', typeof dsIncident.desc);
          return 'desc not valid';
        } else if (dsIncident.date && typeof dsIncident.date !== 'string') {
          console.log('date', typeof dsIncident.date);
          return 'date not valid';
        } else if (dsIncident.src && dsIncident.src.length <= 0) {
          console.log('src');
          return 'src not valid';
        } else if (dsIncident.tags && dsIncident.tags.length <= 0) {
          console.log('tags');
          return 'tags not valid';
        } else {
          console.log('valid');
          return 'valid';
        }
      }
    });
  });
});
