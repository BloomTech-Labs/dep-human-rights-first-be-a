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
