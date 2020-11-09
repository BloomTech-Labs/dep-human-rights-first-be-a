exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('incident_sources')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('incident_sources').insert([{ src_id: 1, incident_id: 1 }]);
    });
};
