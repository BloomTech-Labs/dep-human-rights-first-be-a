/* eslint-disable */

const Constants = require('../constants/incidentConstants');

module.exports = {
  validateIncidents,
  processSources,
  getStateAbbrev,
};

//checks that an incident object has a title, desc city, state, late, long, date, tags and src keys that are defined and not an empty string
function validateIncidents(incident) {
  const incident_keys = [
    'title',
    'desc',
    'city',
    'state',
    'lat',
    'long',
    'date',
    'tags',
    'src',
  ];
  for (let i = 0; i < incident_keys.length; i++) {
    if (
      !incident.hasOwnProperty(incident_keys[i]) ||
      incident[incident_keys[i]] === '' ||
      incident[incident_keys[i]] === undefined ||
      incident[incident_keys[i]] === null
    ) {
      return false;
    }
  }
  return true;
}

//checks the base url of a source and compares it to the probability list of type of sources and adds the appropiate source type to the source object
function processSources(sources) {
  incident_src = [];
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
    incident_src.push(s);
  });

  return incident_src;
}

//returns the state abbreviation for the state passed or false if the state doesn't match any state names in the list
function getStateAbbrev(state) {
  const states = Constants.state_abbrev;

  for (let i = 0; i < states.length; i++) {
    if (states[i][0] === state) {
      return states[i][1];
    }
  }
  return false;
}
