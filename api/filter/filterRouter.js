const express = require('express');
const router = express.Router();

//Model and util imports
const Filter = require('./filterModel');

//Filter routes
/**
 * @swagger
 * /forceCounts:
 *  get:
 *    description: returns an array of objects which holds the type of force used and the count of how many times they are used in the database
 *    tags:
 *      - filter
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: returns a filter object with types of force and their associated count
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: array
 *                  example: [{ count: '925', type_of_force: 'protester' },
      { count: '651', type_of_force: 'less-lethal' },
      { count: '344', type_of_force: 'arrest' },
      { count: '318', type_of_force: 'shove' },
      { count: '288', type_of_force: 'shoot' },
      { count: '263', type_of_force: 'tear-gas' },
      { count: '210', type_of_force: 'pepper-spray' },
      { count: '206', type_of_force: 'journalist' },
      { count: '201', type_of_force: 'spray' },
      { count: '180', type_of_force: 'projectile' }]
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
 *                  example: {
 *                          err: "Request error",
 *                          message: "Could not retrieve counts of different forces from database", 
 *                          }
 */
router.get('/forceCounts', async (req, res) => {
  await Filter.getCountTags()
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: 'Could not retrieve counts of different forces from database',
      });
    });
});
module.exports = router;
