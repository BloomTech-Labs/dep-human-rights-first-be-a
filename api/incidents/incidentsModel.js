const db = require('../../data/db-config');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');

module.exports = {
  getAllIncidents,
  createIncident,
};

async function getAllIncidents() {
  return await db('incidents');
}

async function createIncident(incident) {
  const newIncident = {
    id: incident.id,
    city: incident.city,
    state: incident.state,
    title: incident.title,
    lat: incident.lat,
    long: incident.long,
    desc: incident.desc,
    date: incident.date,
  };

  const incidentID = await db('incidents').insert(newIncident, 'incident_id');
  await Sources.createSource(incident.src, incidentID[0]);
  await Tags.createTags(incident.tags, incidentID[0]);
  return { message: 'Success!' };
}
