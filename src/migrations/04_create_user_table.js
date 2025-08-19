/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();

    table.string('name', 100).notNullable().defaultTo('sem nome');
    table.string('lastName', 100).notNullable();
    table.string('email', 150).notNullable().unique();

    table.string('password_hash').notNullable(); // select: false em TypeORM significa esconder no select, mas no DB é varchar/text

    table.string('phone').nullable();

    table.string('bio', 255).nullable();
    table.string('avatarUrl', 255).nullable();

    table.boolean('isActive').notNullable().defaultTo(true);

    // relacionamento com role (FK role_id)
    table.integer('role_id').unsigned().nullable();
    table.foreign('role_id').references('id').inTable('roles').onDelete('SET NULL');

    // relacionamento OneToMany são do lado do usuário, no DB só FK na outra tabela

    table.boolean('isTwoFactorEnabled').notNullable().defaultTo(false);
    table.string('twoFactorSecret').nullable();
    table.text('refreshToken').nullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deletedAt').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
