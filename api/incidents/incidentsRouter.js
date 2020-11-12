const express = require('express');
const router = express.Router();
const axios = require('axios');
const paginate = require('paginate-info');

// Model and util imports
const Incidents = require('./incidentsModel');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');
// const { post } = require('../dsService/dsRouter');
const Middleware = require('./middleware/index');
const { calculateLimitAndOffset } = require('paginate-info');

// ###Incidents Routes###

/**
 * @swagger
 * /showallincidents:
 *  get:
 *    description: root path returning all incidents in database
 *    tags:
 *      - incidents
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: returns an incident object with all sources
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: array
 *                  example: [
        {
            "incident_id": 1,
            "city": "Olympia",
            "state": "Washington",
            "lat": 47.037872,
            "long": -122.900696,
            "title": "Police respond to broken windows with excessive force",
            "desc": "Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.  Police then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.  Police fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.  After police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.  A racial slur can be heard shouted, although it is unsure who is shouting.",
            "date": "2020-05-31T04:00:00.000Z",
            "src": [
                {
                    "src_id": 1,
                    "src_type": "video",
                    "src_url": "https://www.youtube.com/watch?v=s7MM1VauRHo"
                }
            ],
            "categories": [
                {
                    "type_of_force": "arrest",
                    "type_of_force_id": 1,
                    "incident_id": 1
                },
                {
                    "type_of_force": "less-lethal",
                    "type_of_force_id": 2,
                    "incident_id": 1
                },
                {
                    "type_of_force": "projectile",
                    "type_of_force_id": 3,
                    "incident_id": 1
                },
                {
                    "type_of_force": "protester",
                    "type_of_force_id": 4,
                    "incident_id": 1
                },
                {
                    "type_of_force": "shoot",
                    "type_of_force_id": 5,
                    "incident_id": 1
                },
                {
                    "type_of_force": "tear-gas",
                    "type_of_force_id": 6,
                    "incident_id": 1
                }
            ]
        },
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                api:
 *                  type: string
 *                  example: "Request Error"
 */
router.get('/showallincidents/', async (req, res) => {
  await Incidents.showAllIncidents(req.query.limit, req.query.offset)
    .then((incidents) => {
      res.status(200).json({ incidents });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
}); //end showallincidents

/**
 * @swagger
 * /createincidents:
 *  post:
 *    description: Add an instance to the database
 *    tags:
 *      - incidents
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      201:
 *        description: incident created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: object
 *                  example: { message: 'Success!' }
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {"message": "Error creating Record"}
 */
router.post('/createincidents', Middleware.validateIncidents, (req, res) => {
  req.body.forEach((incident) => {
    Incidents.createIncident(incident)

      .then((success) => {
        res.status(201).json(success);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Error creating Record' });
      });
  });
}); //end createIncidents

// ###Sources Routes###
/**
 * @swagger
 * /sources:
 *  get:
 *    description: Get all sources from the database
 *    tags:
 *      - sources
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: return all sources from database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: object
 *                  example: [{incident_id: 123askdj, src_url: someurl@twitter.com, src_type: 'tweet'}]
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {"err": "Error get Sources"}
 */
router.get('/sources', (req, res) => {
  Sources.getAllSources()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}); //end sources

/**
 * @swagger
 * /sources/:id:
 *  get:
 *    description: Gets all sources associated with a given incident ID
 *    tags:
 *      - sources
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: get all sources associated with a given incident ID
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: array
 *                  example: [{incident_id: 123askdj, src_url: someurl@twitter.com, src_type: 'tweet'}, {incident_id: 123askdj, src_url: someurl@reddit.com, src_type: 'news article'}]
 */

// returns all sources associated with incident ID provided
router.get('/sources/:id', (req, res) => {
  const { id } = req.params;
  Sources.getSourcesByIncidentId(id).then((response) => {
    res.json(response);
  });
});

/**
 * @swagger
 * /createsource:
 *  post:
 *    description: Create a source
 *    tags:
 *      - sources
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      201:
 *        description: return all sources from database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {src_id: 3}
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {"error": "Error creating Source"}
 */
router.post('/createsource', Middleware.validateSource, (req, res) => {
  //destructures request body so can be sent to the model function with the appropiate values
  const incident_id = req.body.incident_id;
  let src = {};
  src.src_url = req.body.src_url;
  src.src_type = req.body.src_type;

  Sources.createSource([src], incident_id)
    .then(() => {
      res.status(201).json({ message: 'Success!' });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ###Types of Force (tags) Routes###
/**
 * @swagger
 * /tags:
 *  get:
 *    description: Get all types of force from the database
 *    tags:
 *      - types_of_force
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: return all types of force from database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: array
 *                  example: [{type_of_force_id: 3, type_of_force: taser }]
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {"err": "Error get Types of Force"}
 */
router.get('/tags', (req, res) => {
  Tags.getAllTags()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
/**
 * @swagger
 * /tagtypes/incidentID:
 *  get:
 *    description: Get all types of force for a particular incident from the database
 *    tags:
 *      - types_of_force
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: return all types of force for a particular incident from database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: array
 *                  example: [{itof_id: 3, type_of_force_id: 3, incident_id: 23}]
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                  type: object
 *                  example: {"err": "Error get Types of Force for incident id"}
 */
router.get('/tags/:incidentID', (req, res) => {
  Tags.getTagsByIncidentId(req.params.incidentID)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
});

/**
 * @swagger
 * /fetchfromds:
 *  get:
 *    description: Gets data from DS team
 *    tags:
 *      - utility
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: gets data from DS team
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {message: 'complete'}
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {"err": "Error get data from DS"}
 */
router.get('/fetchfromds', (req, res) => {
  let incidents = [];
  let incidentList = [];

  axios
    .get(process.env.DS_API_URL)
    .then((response) => {
      incidents = response.data;
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.json(err);
    })
    .finally(async () => {
      incidents.forEach((incident) => {
        if (incident.city !== null) {
          let sources = incident.src;
          incident.src = [];

          sources.forEach((source) => {
            let s = { src_url: '', src_type: '' };
            let src_type = '';
            s.src_url = source;
            let url = '';

            let comps = source.split('https://www.')[1];
            if (comps) {
              url = comps.split('.com')[0];
            } else {
              let components = source.split('https://')[1];
              if (components != undefined) {
                let components2 = components.split('.com')[0];
                if (components2.length > 11) {
                  let comps3 = components2.split('.org')[0];
                  if (comps3.length > 10) {
                    url = comps3.split('.')[0];
                  } else {
                    url = comps3;
                  }
                } else {
                  url = components2;
                }
              }
            }

            switch (url) {
              case 'youtube':
              case 'whyy':
              case 'youtu':
              case 'clips':
              case 'tuckbot':
              case 'peertube':
              case 'drive':
              case 'm':
              case 'getway':
                src_type = 'video';
                break;
              case 'instagram':
              case 'twitter':
              case 'reddit':
              case 'papost':
              case 'mobile':
              case 'nyc':
              case 'v':
                src_type = 'post';
                break;
              case 'nlg-la':
              case 'ewscripps':
                src_type = 'court_document';
                break;
              case 'i':
              case 'ibb':
              case 'photos':
                src_type = 'image';
                break;
              case 'doverpolice':
              case 'dsp':
                src_type = 'police_report';
                break;
              default:
                src_type = 'article';
                break;
            }

            s.src_type = src_type;
            incident.src.push(s);
          });
          incidentList.push(incident);
        }
      });
      for (let i = 0; i < incidentList.length; i++) {
        await Incidents.createIncident(incidentList[i]);
      }
    }); //end fetch from ds
});

module.exports = router;
