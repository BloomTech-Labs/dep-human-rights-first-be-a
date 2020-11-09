const db = require('../../data/db-config');

module.exports = {
  getAllSources,
  getSourcesByIncidentId,
  createSource,
  getSourcesByUrl,
};

async function getSourcesByIncidentId(incident_id) {
  return await db('sources')
    .join('incident_sources as is', 'is.src_id', 'sources.src_id')
    .where('incident_id', incident_id)
    .select('sources.src_id', 'sources.src_type', 'sources.src_url');
}

async function createSource(sources, incidentID) {
  for (let i = 0; i < sources.length; i++) {
    let sourceURL = sources[i];
    const src_exists = await getSourcesByUrl(sourceURL.src_url);
    if (src_exists.length > 0) {
      await createIncidentSources(incidentID, src_exists[0]);
    } else {
      const source = {
        src_url: sourceURL.src_url,
        src_type: sourceURL.src_type,
      };
      const srcID = await db('sources').insert(source, 'src_id');
      await createIncidentSources(incidentID, srcID[0]);
    }
  }
}

function getAllSources() {
  return db('sources as s')
    .join('incident_sources as is', 'is.src_id', 's.src_id')
    .select('s.src_id', 's.src_url', 's.src_type', 'is.incident_id');
}

async function getSourcesByUrl(src_url) {
  return db('sources').where({ src_url });
}

async function createIncidentSources(incidentID, srcID) {
  await db('incident_sources').insert({
    incident_id: incidentID,
    src_id: srcID,
  });
}
