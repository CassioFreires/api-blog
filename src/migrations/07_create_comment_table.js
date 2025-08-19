/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('comments', function(table) {
    table.increments('id').primary();

    table.string('content').notNullable();

    table.timestamp('createAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updateAt').defaultTo(knex.fn.now()).notNullable();

    table.integer('post_id').unsigned().notNullable()
      .references('id').inTable('posts')
      .onDelete('CASCADE');

    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments');
};
