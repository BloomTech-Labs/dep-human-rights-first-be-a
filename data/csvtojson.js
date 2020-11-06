/*
    File to get data from csv in S3 bucket hosted on AWS and import into database 
*/
require('dotenv').config();
const AWS = require('aws-sdk');
const csv = require('csvtojson');
const Incidents = require('../api/incidents/incidentsModel');

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
    let tagString = data[i]['force type'];
    let tags = tagString.split('/');
    const incident = {
      id: data[i]['field1'],
      city: data[i]['city'],
      state: data[i]['state'],
      title: 'Police Report',
      lat: data[i]['lat'],
      long: data[i]['lon'],
      desc:
        'Open source database comprising data from different sources which can be found on their webpage.',
      date: data[i]['date'],
      tags: tags,
      src: [
        {
          src_url: 'mappingpoliceviolence.org',
          src_type: 'Post',
        },
      ],
    };
    await Incidents.createIncident(incident);
  }
}
