const express = require('express');
const router = express.Router();
const axios = require('axios');

// Model and util imports
const Incidents = require('./incidentsModel');
// const { post } = require('../dsService/dsRouter');
const { validateIncidents } = require('./middleware/index');

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
 *                  example: [{
        "incident_id": 1,
        "id": "wa-olympia-1",
        "city": "Olympia",
        "state": "Washington",
        "lat": 47.0417,
        "long": -122.8959,
        "title": "Police respond to broken windows with excessive force",
        "desc": "Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.",
        "date": "2020-05-31T04:00:00.000Z",
        "categories": [],
        "src": [
            {
                "src_id": 1,
                "incident_id": 1,
                "src_url": "poopy",
                "src_type": "ecks dee"
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
 *                -api
 *              properties:
 *                api:
 *                  type: string
 *                  example: "Request Error"
 */
router.get('/showallincidents', async (req, res) => {
  try {
    const incidents = await Incidents.getAllIncidents();
    const sources = await Incidents.getAllSources();
    const tofTypes = await Incidents.getAllTags();
    const typeLinks = await Incidents.getAllTagTypes();

    const responseArray = [];
    const tagsArray = [];

    tofTypes.forEach((tof) => {
      typeLinks.forEach((connection) => {
        if (connection.type_of_force_id === tof.type_of_force_id) {
          tagsArray.push({ ...tof, incident_id: connection.incident_id });
        }
      });
    });

    incidents.forEach((incident) => {
      incident['categories'] = [];
      tagsArray.forEach((tag) => {
        if (tag.incident_id === incident.incident_id) {
          incident.categories.push(tag.type_of_force);
        }
      });
    });

    // Reconstructs the incident object with it's sources to send to front end
    incidents.forEach((incident) => {
      incident['src'] = [];
      sources.forEach((source) => {
        if (source.incident_id === incident.incident_id) {
          incident.src.push(source);
        }
      });

      responseArray.push(incident);
    });
    res.json(responseArray);
  } catch (e) {
    res.status(500).json({ message: 'Request Error' });
  }
});

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
router.post('/createincidents', validateIncidents, (req, res) => {
  req.body.forEach((incident) => {
    Incidents.createIncident(incident)

      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Error creating Record' });
      });
  });
});

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
  Incidents.getAllSources()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

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
  Incidents.getSourcesById(id).then((response) => {
    res.json(response);
  });
});

/**
 * @swagger
 * /createsource:
 *  get:
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
router.post('/createsource', (req, res) => {
  Incidents.createSingleSource(req.body)
    .then((response) => {
      res.json(response);
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
  Incidents.getAllTags()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
/**
 * @swagger
 * /tagtypes:
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
router.get('/tagtypes', (req, res) => {
  Incidents.getAllTagTypes()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// ###Utility Routes###
/**
 * @swagger
 * /cleardb:
 *  get:
 *    description: Deletes the contents in the database
 *    tags:
 *      - utility
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: deletes all the contents in the database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: object
 *                  example: {message: 'All database contents have been deleted'}
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
 *                  example: {"error": "Error to delete all contents from database"}
 */
router.delete('/cleardb', (req, res) => {
  Incidents.deleteDB()
    .then((response) => {
      console.log(response);
      res.json({ message: 'All database contents have been deleted' });
    })
    .catch((error) => {
      res.json(error);
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
router.post('/fetchfromds', (req, res) => {
  axios
    .get(process.env.DS_API_URL)
    .then((response) => {
      response.data.forEach((element) => {
        Incidents.createIncident(element);
      });
      res.json({ message: 'complete' });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
