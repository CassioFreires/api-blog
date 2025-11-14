/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('poll_options', function(table) {
    table.increments('id').primary();

    table.integer('poll_id').unsigned().notNullable();
    table.foreign('poll_id').references('id').inTable('polls').onDelete('CASCADE');

    table.string('text').notNullable();

    table.integer('votes').defaultTo(0);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('poll_options');
};
