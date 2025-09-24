/**
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.createTable('friendships', function(table) {
    // Chave primária auto-incrementável
    table.increments('id').primary();
    
    // Chave estrangeira para o usuário que iniciou o pedido
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Chave estrangeira para o usuário que é o amigo
    table.integer('friend_id').unsigned().notNullable();
    table.foreign('friend_id').references('id').inTable('users').onDelete('CASCADE');

    // Status do relacionamento (pending, accepted, rejected, blocked)
    table.string('status', 20).notNullable().defaultTo('pending');

    // Timestamps para controle de tempo
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('accepted_at').nullable();
    
    // Restrições
    // Garante que a amizade não seja consigo mesmo
    table.check('user_id != friend_id', [], 'check_not_self_friend');
    
    // Impede duplicação de pedidos de amizade
    table.unique(['user_id', 'friend_id'], 'unique_friendship');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('friendships');
};