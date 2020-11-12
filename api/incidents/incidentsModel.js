const db = require('../../data/db-config');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');

module.exports = {
  getAllIncidents,
  createIncident,
  showAllIncidents,
};

async function getAllIncidents() {
  return db('incidents');
}

async function createIncident(incident) {
  const newIncident = {
    city: incident.city,
    state: incident.state,
    title: incident.title,
    lat: incident.lat,
    long: incident.long,
    desc: incident.desc,
    date: incident.date,
  };

  const tagList = incident.tags;

  const incidentID = await db('incidents').insert(newIncident, 'incident_id');
  await Sources.createSource(incident.src, incidentID[0]);

  if (tagList[0] != '') {
    for (let i = 0; i < tagList.length; i++) {
      await Tags.createTags(tagList[i], incidentID[0]);
    }
  }
  return { message: 'Success!' };
}

async function showAllIncidents(limit, offset) {
  // return db('incidents').then(async (response) => {
  //   if (response.length > 0) {
  //     return db('incidents').limit(limit).offset(offset);
  //   } else {
  //     return [];
  //   }
  const incidents = await db('incidents').limit(limit).offset(offset);
  for (let i = 0; i < incidents.length; i++) {
    let sources = await Sources.getSourcesByIncidentId(
      incidents[i].incident_id
    );

    let tags = await Tags.getTagsByIncidentId(incidents[i].incident_id);

    incidents[i]['src'] = sources;
    incidents[i]['categories'] = tags;
  }
  return incidents;
}
