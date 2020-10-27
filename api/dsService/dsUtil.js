const axios = require('axios')

// model imports
const incidentsModel = require('../incidents/incidentsModel')

module.exports = {
    dsFetch
}

function dsFetch() {
    return axios
    .get(process.env.DS_API_URL)
    .then((response) => {
      response.data.forEach((element) => {
        incidentsModel.createIncident(element);
      });
    })
    .catch((err) => {
      console.log('Server Error');
    });
}