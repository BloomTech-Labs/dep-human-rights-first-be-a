const db = require('../../data/db-config');

module.exports = {
  createTags,
  getAllTags,
  getTagsByIncidentId,
};

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

async function getTagsByIncidentId(incident_id) {
  return db('type_of_force').where({ incident_id });
}
