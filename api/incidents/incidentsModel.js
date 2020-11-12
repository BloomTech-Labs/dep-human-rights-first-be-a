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
  return db('incidents').then(async (response) => {
    if (response.length > 0) {
      return db('incidents as i')
        .join('incident_sources as iss', 'iss.incident_id', 'i.incident_id')
        .join('sources as s', 's.src_id', 'iss.src_id')
        .join(
          'incident_type_of_force as itof',
          'itof.incident_id',
          'i.incident_id'
        )
        .join(
          'type_of_force as tof',
          'tof.type_of_force_id',
          'itof.type_of_force_id'
        )
        .select(
          'i.incident_id',
          'i.city',
          'i.lat',
          'i.long',
          'i.desc',
          'i.date',
          'i.title',
          'i.state',
          's.src_type',
          's.src_url',
          'tof.type_of_force'
        )
        .limit(limit)
        .offset(offset);
    } else {
      return [];
    }
  });
}
