/*
    File to get data from csv in S3 bucket hosted on AWS and import into database 
*/
require('dotenv').config();
const AWS = require('aws-sdk');
const csv = require('csvtojson');
const Incidents = require('../api/incidents/incidentsModel');
const uniqid = require('uniqid');

const S3 = new AWS.S3();

const params = {
  Bucket: 'hrf-team-a',
  Key: 'Compiled_Police_Reports.csv',
};

async function csvTojson() {
  //get csv file and create stream
  const stream = S3.getObject(params).createReadStream();

  //convsert csv file to JSON format data
  const json = await csv().fromStream(stream);
  addToDb(json);
}

csvTojson();

async function addToDb(data) {
  for (let i = 0; i < data.length; i++) {
    if (
      data[i]['lat'] != '' &&
      data[i]['lon'] != '' &&
      data[i]['date'] != 'unreported' &&
      data[i]['date'] != '' &&
      data[i]['force type'] &&
      data[i]['force type'] != ''
    ) {
      let tagString = data[i]['force type'];
      let tags = tagString.split('/');
      let tagList = [];

      tags.forEach((tag) => {
        let splitTags = tag.split(' ');
        splitTags.forEach((t) => {
          switch (t) {
            case 'OC':
            case 'Pepper':
              tagList.push('chemical');
              break;
            case 'Firearm':
              tagList.push('projectiles');
              break;
            case 'Lethal-Taser':
              tagList.push('energy devices');
              break;
            case 'Physical-Hands':
            case 'Physical-Weight':
            case 'Physical-Joint':
            case 'Pressure':
            case 'Physical-Take':
            case 'Physical-Kick':
            case 'Physical-Palm':
              tagList.push('presence');
              break;
            case 'Lethal-Pepperball':
            case 'Lethal-Baton':
              tagList.push('hard');
              break;
            default:
              tagList.push('other');
              break;
          }
        });
      });

      const incident = {
        id: uniqid(),
        city: data[i]['city'],
        state: data[i]['state'],
        title: 'Police Report',
        lat: data[i]['lat'],
        long: data[i]['lon'],
        desc:
          'Open source database comprising data from different sources which can be found on their webpage.',
        date: data[i]['date'],
        tags: tagList,
        src: [
          {
            src_url: 'mappingpoliceviolence.org',
            src_type: 'Post',
          },
        ],
      };
      try {
        await Incidents.createIncident(incident);
      } catch (error) {
        console.log(error);
        console.log(incident);
      }
    }
  }
}
