const express = require('express');
const router = express.Router();
const axios = require('axios');

// Model and util imports
const Incidents = require('./incidentsModel');
const Sources = require('../sources/sourcesModel');
const Tags = require('../tags/tagsModel');
// const { post } = require('../dsService/dsRouter');
const Middleware = require('./middleware/index');

// ###Incidents Routes###

/**
 * @swagger
 * /showallincidents?limit=5&offset=0:
 *  get:
 *    description: Root path returning all incidents in database. Allows for query string to specify a limit and offset on the data in order to implement pagination.
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
            "state_abbrev": "WA",
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
        }]
 *      500:
 *        description: Server response error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request Error"
 *                message:
 *                  type: string
 *                  example: "Could not retrieve incidents from database"
 */
router.get('/showallincidents/', async (req, res) => {
  await Incidents.showAllIncidents(req.query.limit, req.query.offset)
    .then((incidents) => {
      res.status(200).json({ incidents });
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message,
        message: 'Could not retrieve incidents from database',
      });
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
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error creating incident"
 */

//Need to make middleware function specifically for one incident being added vs from a list received from DS

router.post('/createincidents', (req, res) => {
  if (req.body.length > 0) {
    req.body.forEach((incident) => {
      Incidents.createIncident(incident)
        .then((success) => {
          res.status(201).json({ message: 'Success!', incident_id: success });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ err: err.message, message: 'Error creating incident' });
        });
    });
  } else {
    res.status(500).json({ message: 'Error creating incident' });
  }
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
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error getting sources"
 */
router.get('/sources', (req, res) => {
  Sources.getAllSources()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ err: err.message, message: 'Error getting sources' });
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
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error getting sources"
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
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error creating source"
 */

//Need to implement better validate source function

router.post('/createsource', (req, res) => {
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
      res.status(500).json({
        err: error.message,
        message: 'Error creating source',
      });
    });
});

// ###Types of Force (tags) Routes###
/**
 * @swagger
 * /tags:
 *  get:
 *    description: Get all types of force from the database
 *    tags:
 *      - type_of_force
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
 *                  example: [{type_of_force_id: 3, type_of_force: taser, incident_id: 1 }]
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error getting types of force"
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
 * /tags/:incidentID:
 *  get:
 *    description: Get all types of force for a particular incident from the database
 *    tags:
 *      - type_of_force
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
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error getting types of force for incident id"
 */
router.get('/tags/:incidentID', (req, res) => {
  Tags.getTagsByIncidentId(req.params.incidentID)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message,
        message: 'Error getting types of force for incident id',
      });
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
 *                - responseArray
 *              properties:
 *                responseArray:
 *                  type: array
 *                  example: [
 *                    {
 *                      "incident_id": 1,
            "city": "Olympia",
            "state": "Washington",
            "lat": 47.037872,
            "long": -122.900696,
            "title": "Police respond to broken windows with excessive force",
            "desc": "Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.  Police then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.  Police fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.  After police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.  A racial slur can be heard shouted, although it is unsure who is shouting.",
            "date": "2020-05-31T04:00:00.000Z",
            "categories": [
                "arrest",
                "less-lethal",
                "projectile",
                "protester",
                "shoot",
                "tear-gas"
            ],
            "src": [
                {
                    "src_id": 1,
                    "src_url": "https://www.youtube.com/watch?v=s7MM1VauRHo",
                    "src_type": "video"
                }
            ]
 *                    }
 *                  ]
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                -err
 *                -message
 *              properties:
 *                err:
 *                  type: string
 *                  example: "Request error"
 *                message:
 *                  type: string
 *                  example: "Error getting data from DS API"
 */
router.get('/fetchfromds', async (req, res) => {
  let incidents = [];
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
      for (let i = 0; i < incidents.length; i++) {
        let incident = incidents[i];
        if (Middleware.validateIncidents(incident)) {
          await Incidents.checkIncidentExists(incident)
            .then(async (check) => {
              if (check.length <= 0) {
                //process sources so they are in proper format
                incident.src = Middleware.processSources(incident.src);
                incident['state_abbrev'] = Middleware.getStateAbbrev(
                  incident.state
                );
                //getStateAbbrev will return false if no matching state provided
                if (incident.state_abbrev) {
                  //adds incident to db
                  await Incidents.createIncident(incident);
                }
              } else {
                //incident exists in db
                return;
              }
            })
            .catch((e) => {
              console.log('ds catch in finally', e.message);
            });
        }
      }
    });
}); //end fetch from ds

module.exports = router;
