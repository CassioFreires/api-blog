const { nullable } = require('zod/v4');

/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('posts', function(table) {
    table.increments('id').primary();
    table.string('title').nullable();
    table.string('subtitle').nullable();
    table.string('content').nullable();
    table.string('image_url').nullable();

    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.integer('category_id').unsigned().notNullable()
      .references('id').inTable('categories')
      .onDelete('CASCADE')
      .onUpdate('CASCADE'); // ✅ aqui estava sem ;

    table.timestamp('createAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('delatAt').nullable();

    table.index('user_id');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('posts');
};
