const db = require('../../data/db-config');

module.exports = {
  getAllSources,
  getSourcesByIncidentId,
  createSource,
  getSourcesByUrl,
};

//returns array of source obejects that is associated with the passed in incident id
async function getSourcesByIncidentId(incident_id) {
  return await db('sources')
    .join('incident_sources as is', 'is.src_id', 'sources.src_id')
    .where('incident_id', incident_id)
    .select('sources.src_id', 'sources.src_type', 'sources.src_url');
}

//creates a source in the database and associates it with the given incident id
async function createSource(sources, incidentID) {
  for (let i = 0; i < sources.length; i++) {
    let sourceURL = sources[i];
    try {
      const src_exists = await getSourcesByUrl(sourceURL.src_url);
      if (src_exists.length > 0) {
        await createIncidentSources(incidentID, src_exists[0].src_id);
      } else {
        const source = {
          src_url: sourceURL.src_url,
          src_type: sourceURL.src_type,
        };
        const srcID = await db('sources').insert(source, 'src_id');
        await createIncidentSources(incidentID, srcID[0]);
      }
    } catch {
      const source = {
        src_url: sourceURL.src_url,
        src_type: sourceURL.src_type,
      };
      const srcID = await db('sources').insert(source, 'src_id');
      await createIncidentSources(incidentID, srcID[0]);
    }
  }
}

//returns an array of all source objects found in the database
function getAllSources() {
  return db('sources as s')
    .join('incident_sources as is', 'is.src_id', 's.src_id')
    .select('s.src_id', 's.src_url', 's.src_type', 'is.incident_id');
}

//returns a source object whose url matches the url being passed in
async function getSourcesByUrl(src_url) {
  return db('sources').where({ src_url });
}

//adds the relationship between a particular source and a particular incident into the appropiate relationship table
async function createIncidentSources(incidentID, srcID) {
  await db('incident_sources').insert({
    incident_id: incidentID,
    src_id: srcID,
  });
}
