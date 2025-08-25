
exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().defaultTo('sem nome');
    table.string('lastName', 100).nullable();
    table.string('email', 150).notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('phone').nullable();
    table.string('bio', 255).nullable();
    table.string('avatarUrl', 255).nullable();
    table.boolean('isActive').notNullable().defaultTo(true);
    table.integer('role_id').unsigned().notNullable().defaultTo(4)
      .references('id').inTable('roles')
      .onDelete('SET DEFAULT').onUpdate('CASCADE');
    table.boolean('isTwoFactorEnabled').notNullable().defaultTo(false);
    table.string('twoFactorSecret').nullable();
    table.text('refreshToken').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deletedAt').nullable();

    table.index(['email']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
