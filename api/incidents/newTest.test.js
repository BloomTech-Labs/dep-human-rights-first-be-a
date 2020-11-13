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
    console.log(
      'need to find a way to check if an object has all required keys'
    );
  });
});
