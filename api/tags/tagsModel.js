const db = require('../../data/db-config');

module.exports = {
  createTags,
  getAllTags,
  getTagsByIncidentId,
};

async function createTags(tag, incidentID) {
  const tagId = await db('type_of_force').insert(
    { type_of_force: tag },
    'type_of_force_id'
  );
  await createIncidentTypeOfForce(incidentID, tagId[0]);
}

async function createIncidentTypeOfForce(incidentID, tagId) {
  await db('incident_type_of_force').insert({
    incident_id: incidentID,
    type_of_force_id: tagId,
  });
}

function getAllTags() {
  return db('type_of_force as tof')
    .join(
      'incident_type_of_force as itof',
      'itof.type_of_force_id',
      'tof.type_of_force_id'
    )
    .join('incidents as i', 'i.incident_id', 'itof.incident_id')
    .select('tof.type_of_force_id', 'tof.type_of_force', 'itof.incident_id');
}

async function getTagsByIncidentId(incident_id) {
  return db('type_of_force').where({ incident_id });
}
