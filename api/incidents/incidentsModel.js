const db = require('../../data/db-config');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');
const Middleware = require('../incidents/middleware/index');

module.exports = {
  getAllIncidents,
  createIncident,
  showAllIncidents,
  checkIncidentExists,
};

//returns a list of all incident objects in database
async function getAllIncidents() {
  return db('incidents');
}

//creates new incident for database using an instance object being passed to the function
//calls the functions to add the type of force (tag) related to the incident as well as the sources related
//returns the id of the newly created incident object in the database
async function createIncident(incident) {
  if (Middleware.validateIncidents(incident)) {
    const newIncident = {
      city: incident.city,
      state: incident.state,
      title: incident.title,
      lat: incident.lat,
      long: incident.long,
      desc: incident.desc,
      date: incident.date,
      state_abbrev: incident.state_abbrev,
    };

    const tagList = incident.tags;

    const incidentID = await db('incidents').insert(newIncident, 'incident_id');
    await Sources.createSource(incident.src, incidentID[0]);

    if (tagList[0] != '') {
      for (let i = 0; i < tagList.length; i++) {
        await Tags.createTags(tagList[i], incidentID[0]);
      }
    }

    return incidentID;
  }
}

//returns a list of all incidents including the associated sources and tags (type of force)
async function showAllIncidents(limit, offset = 0) {
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

//returns an array of incident objects matching the incident being passed to the function
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
