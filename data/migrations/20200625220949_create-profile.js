exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('incidents', (incidents) => {
      incidents.increments('incident_id');
      incidents.string('id').unique().notNullable();
      incidents.string('city').notNullable();
      incidents.string('state').notNullable();
      incidents.float('lat').notNullable();
      incidents.float('long').notNullable();
      incidents.string('title').notNullable();
      incidents.varchar('desc', [1000]);
      incidents.date('date');
    })
    .createTable('sources', (sources) => {
      sources.increments('src_id').notNullable().unique().primary();
      sources.integer('incident_id');
      sources.string('src_url');
      sources.string('src_type');
    })
    .createTable('type_of_force', (type_of_force) => {
      type_of_force.increments('type_of_force_id');
      type_of_force.string('type_of_force');
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('incidents')
    .dropTableIfExists('sources')
    .dropTableIfExists('type_of_force');
};
