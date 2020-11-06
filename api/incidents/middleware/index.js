const db = require('../../../data/db-config');

module.exports = {
  validateIncidents,
  validateSource,
};

function validateIncidents(req, res, next) {
  if (req.body.length > 0) {
    req.body = req.body.filter((incident) => {
      if (
        incident.lat &&
        incident.long &&
        incident.city &&
        incident.id &&
        incident.state &&
        incident.title &&
        incident.desc &&
        incident.date
      ) {
        const id = db('incidents').where('id', incident.id);
        if (!id[0]) return incident;
      }
    });
    next();
  } else {
    res.status(500).json({ message: 'Error creating Record' });
  }
}

function validateSource(req, res, next) {
  if (req.body != null) {
    if (req.body.incident_id && req.body.src_url && req.body.src_type) {
      next();
    } else {
      res
        .status(400)
        .json({ message: 'Missing incident id, source url or source type' });
    }
  } else {
    res.status(400).json({ message: 'Include source information' });
  }
}
