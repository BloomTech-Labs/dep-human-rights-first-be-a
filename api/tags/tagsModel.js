const db = require('../../data/db-config');

module.exports = {
  createTags,
  getAllTags,
  getTagsByIncidentId,
  getTagsByName,
};

//creates new type of force for a given incident
async function createTags(tag, incidentID) {
  //checks if the type of force is already in database
  let checkTag = await getTagsByName(tag);

  if (checkTag.length <= 0) {
    //if not in database adds the new type of force to the database and sends the incident id and type of force id to the createIncidentTypeOfForce function
    const tagId = await db('type_of_force').insert(
      { type_of_force: tag },
      'type_of_force_id'
    );
    await createIncidentTypeOfForce(incidentID, tagId[0]);
  } else {
    //if in database retrieves the id of the type of force and sends the incident id and type of force id to the createIncidentTypeOfForce function
    const forceId = checkTag[0]['type_of_force_id'];
    await createIncidentTypeOfForce(incidentID, forceId);
  }
}

//adds the relationship between an incident and a type of force into the appropiate table
async function createIncidentTypeOfForce(incidentID, tagId) {
  await db('incident_type_of_force').insert({
    incident_id: incidentID,
    type_of_force_id: tagId,
  });
}

//returns a list of all types of forces in the database
async function getAllTags() {
  return db('type_of_force as tof')
    .join(
      'incident_type_of_force as itof',
      'itof.type_of_force_id',
      'tof.type_of_force_id'
    )
    .join('incidents as i', 'i.incident_id', 'itof.incident_id')
    .select('tof.type_of_force_id', 'tof.type_of_force', 'itof.incident_id');
}

//get all the types of force associated with a given incident id
async function getTagsByIncidentId(incident_id) {
  return db('type_of_force as tof')
    .join(
      'incident_type_of_force as itof',
      'itof.type_of_force_id',
      'tof.type_of_force_id'
    )
    .select('tof.type_of_force', 'tof.type_of_force_id', 'itof.incident_id')
    .where('itof.incident_id', incident_id);
}

//returns the type of force object that matches the type of force given
async function getTagsByName(type_of_force) {
  return db('type_of_force').where({ type_of_force });
}
