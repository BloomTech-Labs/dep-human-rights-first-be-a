/* eslint-disable */
const db = require('../../data/db-config');
const Incidents = require('./incidentsModel');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');

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
