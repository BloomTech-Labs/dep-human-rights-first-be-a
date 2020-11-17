# Human Rights First A

You can find the deployed project at [Human Rights First](https://main.d2v2y4y91pkwd.amplifyapp.com/).

## Description
We partnered with Human Right First organization which is a non-profit advocacy group dedicated to ensuring justice for everyone based on the values that America was founded on. Human Rights First wanted a web application that was available for anyone to be able to see where incidents that involved police using force was occurring in America and how often that was occurring.

Based off of current events that labeled excessive police use of force in certain areas as outliers for the system in place. Human Rights First wanted a visual application that could show that these incidents were indeed outliers or if they were a product of a deeper rooted problem that should be addressed. 

Our team was tasked with improving visualizations of the previous codebase, making sure the data being rendered was coming from the backend API which retrieved data from the DS API and retrieving data points from multiple sources. 

### Key Features

- User can view incidents of police use of force and get more information on specific incidents
- User can search map based on type of force, location, and date
- User can view graphs which show which type of force is used the most and the locations where incidents occur


## Contributors 

## Front End
| [Antonio Baez](https://github.com/tonomb) | [Ashley Bergsma](https://github.com/ashley-bergsma) | [Maryam Mosstoufi](https://github.com/MaryamMosstoufi) | 
| :---: | :---: | :---: |
| [<img src="https://ca.slack-edge.com/ESZCHB482-W012HMFH8E9-31ae71ede6a6-512" width="200" />](https://github.com/tonomb) | [<img src="https://ca.slack-edge.com/ESZCHB482-W0149MPSWE8-d8db5d0bd3c6-512" width="200" />](https://github.com/ashley-bergsma) | [<img src="https://ca.slack-edge.com/ESZCHB482-W0138Q5T9AL-32b57d34cfe5-512" width="200" />](https://github.com/MaryamMosstoufi) |
| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/antoniomtzb/)| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/ashleybergsma89/) |[ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/maryammosstoufi/) |

## Back End
| [Jessica Duell](https://github.com/jduell12) |
| :---: |                                                    
| [<img src="https://ca.slack-edge.com/ESZCHB482-W012XHX0325-7d8c97aaa89d-512" width="200" />](https://github.com/jduell12) |                                          
| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/jessicaduell/) |

## Data Science 
| [Ben Witter](https://github.com/Witterone) | [Terrence Malone](https://github.com/TerrenceAm22) |
| :---: | :---: |
| [<img src="https://ca.slack-edge.com/ESZCHB482-W012K5V3K43-e63794cbcf42-512" width = "200" />](https://github.com/Witterone) | [<img src="https://ca.slack-edge.com/ESZCHB482-W012JQ51H19-d8d45b8f0f6b-512" width = "200"/>](https://github.com/TerenceAM22)|
| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/benjamin-witter-a8980a50/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/terrence-malone/) |

## Deployed Product 
- [Front End](https://main.d2v2y4y91pkwd.amplifyapp.com/) 
- [Back End](https://hrf-a-api.herokuapp.com/) 
- [DS](http://human-rights-first-ds-a.eba-yikxuxau.us-east-1.elasticbeanstalk.com/) 

## Project Repositories 
- [Front End](https://github.com/Lambda-School-Labs/human-rights-first-fe-a)
- [Back End](https://github.com/Lambda-School-Labs/human-rights-first-be-a/tree/main)
- [DS](https://github.com/Lambda-School-Labs/human-rights-first-ds-a)

## Getting Stated - Back End 
- We inherited a project that had been designed and implementated in a previous labs group. Their repository can be found [here](https://github.com/Lambda-School-Labs/human-rights-first-be-a/tree/730ec3207aef416d626c582c24c8c74c39890db2).

- [Product Roadmap](https://www.notion.so/Human-Rights-First-Roadmap-Labs-28-4725bc357588498587902fed9d9b78c5)

- There is an installation instructions file for installing all dependcies and getting docker set up


## Tech Stack
- Database 
  - postgres 
  - knex 

- API
  - language used
    - JavaScript
      - express
  - documentation
    - swagger docs
  - loggers
    - helmet
    - morgan
  - utility 
    - axios
    - dotenv

### dependencies
    @okta/jwt-verifier: ^1.0.0
    axios: ^0.19.2
    cookie-parser: ~1.4.4
    cors: ^2.8.5
    debug: ~2.6.9
    dotenv: ^8.2.0
    express: ^4.16.4
    faker": ^4.1.0
    helmet": ^3.23.1
    http-errors: ~1.6.3
    knex: ^0.21.6
    knex-cleaner: ^1.3.1
    morgan: ~1.9.1
    node-cron: ^2.0.3
    pg: ^8.2.1
    swagger-jsdoc: ^4.0.0
    swagger-ui-express: ^4.1.4

  
## User Flow
[User Flow](https://camo.githubusercontent.com/4ec523c72040be7aaa7728f91749104654d752d55c153c720c8ba73e653bd4a4/68747470733a2f2f692e6962622e636f2f587431737738312f48756d616e2d5269676874732d46697273742d312d3235782e706e67)

## Architecture 
[Technical Architecture](https://whimsical.com/hrf-architecture-JmcmB2Q6VCU3rsLCQGrXAu)

## Updates To Repo in Labs 28 
[Database Schema](https://whimsical.com/human-rights-first-DZVHBA6A5pAnSE6BPUxeTR)

## End Points
### incidents table

| Name         | Type       | Required | Description                                          |
| ------------ | ---------- | -------- | ---------------------------------------------------- |
| incident_id  | Increments | Yes      | unique identifier                                    |
| city         | String     | Yes      | gives the city the incident took place               |
| state        | String     | Yes      | gives the state the incident took place              |
| state_abbrev | String     | Yes      | state abbreviation                                   |
| lat          | Float      | Yes      | gives the latitude of the incident on the world map  |
| long         | Float      | Yes      | gives the longitude of the incident on the world map |
| title        | String     | Yes      | gives the title of the incident                      |
| desc         | Varchar    | No       | gives the description of the incident                |
| date         | Date       | No       | gives the date of the incident                       |

### sources table

| Name     | Type       | Required | Description               |
| -------- | ---------- | -------- | ------------------------- |
| src_id   | Increments | Yes      | unique identifier         |
| src_url  | String     | No       | gives url of the incident |
| src_type | String     | No       | gives url type            |

### type_of_force table

| Name             | Type       | Required | Description             |
| ---------------- | ---------- | -------- | ----------------------- |
| type_of_force_id | Increments | Yes      | unique identifier       |
| type_of_force    | String     | Yes      | gives type of force tag |

### incident_type_of_force table

| Name             | Type       | Required | Description                       |
| ---------------- | ---------- | -------- | --------------------------------- |
| itof_id          | Increments | Yes      | unique identifier                 |
| type_of_force_id | Integer    | Yes      | relates to specific type of force |
| incident_id      | Integer    | Yes      | relates to specific incident      |

### incident_sources

| Name        | Type       | Required | Description                  |
| ----------- | ---------- | -------- | ---------------------------- |
| is_id       | Increments | Yes      | unique identifier            |
| src_id      | Integer    | Yes      | relates to specific source   |
| incident_id | Integer    | Yes      | relates to specific incident |

#### Responses:

[API Docs](https://hrf-a-api.herokuapp.com/api-docs/)

> GET /showallincidents Will receive a **200 (OK)** response with an array of incidents if the request is successful
> GET /showallincidents?limit=5&offset=0 Will receive a **200 (OK)** response with an array of 5 incidents offset by 0 if the request is successful

```javascript
[
  {
    incident_id: 'Test',
    city: 'test',
    state: 'test',
    state_abbrev: 'test',
    lat: 'test',
    long: 'test',
    title: 'test',
    desc: 'test',
    date: 'test',
    src: [
      {
        src_id: 'srcTest',
        src_type: 'typeTest',
        src_url: 'urlTest',
      },
    ],
    categories: [
      {
        type_of_force: 'force1',
        type_of_force_id: 'forceTest',
        incident_id: 'Test',
      },
    ],
  },
  {
    incident_id: 'Test2',
    city: 'test',
    state: 'test',
    state_abbrev: 'test',
    lat: 'test',
    long: 'test',
    title: 'test',
    desc: 'test',
    date: 'test',
    src: [
      {
        src_id: 'srcTest2',
        src_type: 'typeTest',
        src_url: 'urlTest2',
      },
    ],
    categories: [
      {
        type_of_force: 'force1',
        type_of_force_id: 'forceTest',
        incident_id: 'Test2',
      },
      {
        type_of_force: 'force2',
        type_of_force_id: 'forceTest2',
        incident_id: 'Test2',
      },
    ],
  },
];
```

> Will receive a **500 (Internal Server Error)** response if there is an issue with grabing the data

```javascript
{
  "err": "Request Error",
  "message": "Could not retrieve incidents from database"
}
```

---

> POST /createincidents Will receive a **201 (Created)** response along wtih the newly created incident if successful

```javascript
[
  {
    incident_id: 'Test',
    city: 'test',
    state: 'test',
    state_abbrev: 'test',
    lat: 'test',
    long: 'test',
    title: 'test',
    desc: 'test',
    date: 'test',
    src: [
      {
        src_id: 'srcTest',
        src_type: 'typeTest',
        src_url: 'urlTest',
      },
    ],
    categories: [
      {
        type_of_force: 'force1',
        type_of_force_id: 'forceTest',
        incident_id: 'Test',
      },
    ],
  },
];
```

> Will receive a **500 (Internal Server Error)** response if there is an issue with the API server

```javascript
{
    "err": "Request error",
    "message": "Error creating incident"
}
```

---

> GET /sources Will receive a **200 (OK)** response with an array of sources if the request is successful

```javascript
[
  {
    src_id: 'Test',
    incident_id: 'Test',
    src_url: 'test',
    src_type: 'test',
  },
  {
    src_id: 'Test',
    incident_id: 'Test',
    src_url: 'test',
    src_type: 'test',
  },
  {
    src_id: 'Test',
    incident_id: 'Test',
    src_url: 'test',
    src_type: 'test',
  },
];
```

> Will receive a **500 (Internal Server Error)** response if there is an issue with grabing the data

```javascript
{
  "err": "Request error",
  "message": "Error getting sources"
}
```

---

> GET /sources/:id Will receive a **200 (OK)** response with an array of sources for the given incident id if the request is successful

```javascript
[
  {
    src_id: 'Test',
    src_url: 'test',
    src_type: 'test',
  },
  {
    src_id: 'Test',
    src_url: 'test',
  },
];
```

> Will receive a **500 (Internal Server Error)** response if there is an issue with grabing the data

```javascript
{
  "err": "Request error",
  "message": "Error getting sources"
}
```

---

> POST /createsource Will receive a **201 (Created)** response along wtih the newly created source id if successful

```javascript
  {
    "src_id": "Test",
  },

```

> Will receive a **500 (Internal Server Error)** response if there is an issue with the API server

```javascript
{
    "err": "Request error",
    "message": "Error creating source"
}
```

---

> GET /tags Will receive a **200 (OK)** response with an array of tags if the request is successful

```javascript
[
  {
    type_of_force_id: 'Test',
    type_of_force: 'Test',
    incident_id: 'test',
  },
  {
    type_of_force_id: 'Test',
    type_of_force: 'Test',
    incident_id: 'test',
  },
  {
    type_of_force_id: 'Test',
    type_of_force: 'Test',
    incident_id: 'test',
  },
];
```

> Will receive a **500 (Internal Server Error)** response if there is an issue with grabing the data

```javascript
{
  "err": "Request error",
  "message": "Error getting types of force"
}
```

---

> GET /tags/:incidentID Will receive a **200 (OK)** response with an array of types of force for the given incident id if the request is successful

```javascript
[
  {
    type_of_force_id: 'test',
    type_of_force: 'test',
    incident_id: 'test',
  },
  {
    type_of_force_id: 'test',
    type_of_force: 'test',
    incident_id: 'test',
  },
  {
    type_of_force_id: 'test',
    type_of_force: 'test',
    incident_id: 'test',
  },
];
```

> Will receive a **500 (Internal Server Error)** response if there is an issue with grabing the data

```javascript
{
  "err": "Request error",
  "message": "Error getting types of force for incident id"
}
```

---

> GET /fetchfromds Will receive a **200 (OK)** response with an array of data received from DS API

```javascript
[
  {
    incident_id: Test,
    city: Test,
    state: Test,
    lat: Test,
    long: Test,
    title: Test,
    desc: Test,
    date: Test,
    categories: [Test, Test2, Test3],
    src: [{ src_id: Test, src_url: Test, src_type: Test }],
  },
];
```

> Will return **500 (Internal server error)** if there is a problem getting the data

```javascript
{
  "err": "Request error",
  "message": "Error data from DS API"

}

```

---

> GET /filter Will receive a **200 (OK)** response with an array of types of force with their associated count

```javascript
[
  {
    count: 255,
    type_of_force: 'Test',
  },
  {
    count: 255,
    type_of_force: 'Test',
  },
];
```

> Will receive a **500 (Internal Server error)** response if there is an issue with the API server

```javascript
  {
    "err": "Request error",
    "message": "Could not retrieve counts of different forces from database"
  }
```

---


## Issues

## Future Features

## Support 

