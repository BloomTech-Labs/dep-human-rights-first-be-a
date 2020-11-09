const db = require('../../data/db-config');

module.exports = {
  getAllSources,
  getSourcesByIncidentId,
  createSource,
  getSourcesByUrl,
};

async function getSourcesByIncidentId(incident_id) {
  return await db('sources').where('incident_id', incident_id);
}

async function createSource(sources, incidentID) {
  await sources.forEach(async (sourceURL) => {
    const src_exists = await getSourcesByUrl(sourceURL.src_url);
    if (src_exists.length > 0) {
      continue;
    } else {
      const source = {
        incident_id: incidentID,
        src_url: sourceURL.src_url,
        src_type: sourceURL.src_type,
      };
      await db('sources').insert(source);
    }
  });
}

function getAllSources() {
  return db('sources');
}

async function getSourcesByUrl(src_url) {
  return db('sources').where({ src_url });
}
