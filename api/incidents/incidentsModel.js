const db = require('../../data/db-config');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');

module.exports = {
  getAllIncidents,
  createIncident,
  showAllIncidents,
  checkIncidentExists,
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
}

async function showAllIncidents(limit, offset) {
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

async function checkIncidentExists(incident) {
  return db('incidents as i')
    .where('i.city', incident.city)
    .where('i.state', incident.state)
    .where('i.lat', incident.lat)
    .where('i.long', incident.long)
    .where('i.title', incident.title)
    .where('i.desc', incident.desc)
    .where('i.date', incident.date);
}
