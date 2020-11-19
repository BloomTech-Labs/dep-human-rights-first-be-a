exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('incidents', (incidents) => {
      incidents.increments('incident_id');
      incidents.string('city').notNullable();
      incidents.string('state').notNullable();
      incidents.string('state_abbrev').notNullable();
      incidents.float('lat').notNullable();
      incidents.float('long').notNullable();
      incidents.string('title').notNullable();
      incidents.varchar('desc', [10000]);
      incidents.date('date');
    })
    .createTable('sources', (sources) => {
      sources.increments('src_id');
      sources.string('src_url', 10000).notNullable();
      sources.string('src_type').notNullable();
    })
    .createTable('type_of_force', (type_of_force) => {
      type_of_force.increments('type_of_force_id');
      type_of_force.string('type_of_force').notNullable().unique();
    })
    .createTable('incident_type_of_force', (incident_type_of_force) => {
      incident_type_of_force.increments('itof_id');
      incident_type_of_force.integer('type_of_force_id').notNullable();
      incident_type_of_force.integer('incident_id').notNullable();
    })
    .createTable('incident_sources', (incident_sources) => {
      incident_sources.increments('is_id');
      incident_sources.integer('src_id').notNullable();
      incident_sources.integer('incident_id').notNullable();
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('incidents')
    .dropTableIfExists('sources')
    .dropTableIfExists('type_of_force')
    .dropTableIfExists('incident_type_of_force')
    .dropTableIfExists('incident_sources');
};
