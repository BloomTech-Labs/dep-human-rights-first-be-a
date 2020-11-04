const db = require('../../data/db-config');

module.exports = {
  getAllSources,
  createSource,
  getSourcesByIncidentId,
  createSingleSource,
};

async function getSourcesByIncidentId(incident_id) {
  return await db('sources').where('incident_id', incident_id);
}

async function createSource(sources, incidentID) {
  await sources.forEach(async (sourceURL) => {
    const source = {
      incident_id: incidentID,
      src_url: sourceURL.src_url,
      src_type: sourceURL.src_type,
    };
    await db('sources').insert(source);
  });
}

function getAllSources() {
  return db('sources');
}

async function createSingleSource(source) {
  return await db('sources').insert(source, 'src_id');
}
