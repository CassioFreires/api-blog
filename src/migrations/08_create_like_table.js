/**
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('likes', table => {
    table.increments('id').primary();

    table.integer('post_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();

    // Foreign keys
    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Unique constraint (equivalente a @Unique(['post', 'user']))
    table.unique(['post_id', 'user_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('likes');
};
