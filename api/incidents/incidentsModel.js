const db = require('../../data/db-config');
const Sources = require('../sources/sourcesModel');

module.exports = {
  getAllIncidents,
  createIncident,
  getAllTags,
  deleteDB,
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
  await createTags(incident.tags, incidentID[0]);
  return { message: 'Success!' };
}

async function createTags(tags, incidentID) {
  await tags.forEach(async (tag) => {
    await createTypeOfForce({ type_of_force: tag, incident_id: incidentID });
  });
}

async function createTypeOfForce(tof) {
  await db('type_of_force').insert(tof);
}

function getAllTags() {
  return db('type_of_force');
}

async function deleteDB() {
  await db('incident_type_of_force').del();
  await db('type_of_force').del();
  await db('sources').del();
  return await db('incidents').del();
}
