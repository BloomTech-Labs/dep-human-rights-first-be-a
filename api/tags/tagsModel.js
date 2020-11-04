const db = require('../../data/db-config');

module.exports = {
  createTags,
  getAllTags,
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