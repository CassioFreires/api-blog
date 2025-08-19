/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  // Limpa os dados existentes para evitar duplicatas
  await knex('roles').del();

  // Insere os dados de seed
  await knex('roles').insert([
    {
      name: 'admin',
      description: 'Administrador com acesso total ao sistema',
    },
    {
      name: 'editor',
      description: 'Editor com permissão para gerenciar posts e comentários',
    },
    {
      name: 'author',
      description: 'Autor com permissão para criar e editar seus próprios posts',
    },
    {
      name: 'user',
      description: 'Usuário comum que pode visualizar e comentar',
    }
  ]);
};
