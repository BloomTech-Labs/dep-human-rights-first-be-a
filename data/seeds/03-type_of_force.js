exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('type_of_force')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('type_of_force').insert([{ type_of_force: 'hard' }]);
    });
};
