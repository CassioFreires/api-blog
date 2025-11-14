/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('polls', function(table) {
    table.increments('id').primary();
    
    table.integer('post_id').unsigned().notNullable();
    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');

    table.string('question').notNullable();

    table.timestamp('expires_at').nullable();

    table.timestamps(true, true); // created_at e updated_at

    table.timestamp('deleted_at').nullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('polls');
};