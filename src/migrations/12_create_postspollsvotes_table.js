/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('poll_votes', function(table) {
    table.increments('id').primary();

    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');

    table.integer('poll_option_id').unsigned().notNullable()
      .references('id').inTable('poll_options').onDelete('CASCADE');

    table.integer('poll_id').unsigned().notNullable()
      .references('id').inTable('polls').onDelete('CASCADE');

    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    table.unique(['user_id', 'poll_id'], 'unique_user_poll_vote');
  });
};


/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('poll_votes');
};
