const db = require('../../data/db-config');

module.exports = {
  getCountTags,
};

//returns a list of unique types of force in the database with the count of of the frequency they occur in the database ordered from greatest to smallest
async function getCountTags() {
  return db('type_of_force as tof')
    .join(
      'incident_type_of_force as itof',
      'itof.type_of_force_id',
      'tof.type_of_force_id'
    )
    .count('tof.type_of_force_id')
    .groupBy('type_of_force')
    .select('tof.type_of_force')
    .orderBy('count', 'desc');
}
