/**
 * @param {import('knex')} knex 
 */
exports.up = function (knex) {
  return knex.schema.createTable('role_permissions', table => {
    table.increments('id').primary();

    table.integer('role_id').unsigned().notNullable();
    table.integer('permission_id').unsigned().notNullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();

    // Foreign keys
    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE');

    // Optional indexes
    table.index(['role_id']);
    table.index(['permission_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('role_permissions');
};
