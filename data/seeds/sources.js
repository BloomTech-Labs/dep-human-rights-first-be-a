exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('sources')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('sources').insert([
        { incident_id: 1, src_url: 'poopy', src_type: 'ecks dee' },
      ]);
    });
};
