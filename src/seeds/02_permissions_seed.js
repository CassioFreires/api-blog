/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  // Deleta todos os dados existentes para evitar duplicidade
  await knex('permissions').del();

  // Insere dados iniciais
  await knex('permissions').insert([
    { name: 'create_post', description: 'Permissão para criar posts' },   // id 1
    { name: 'edit_post', description: 'Permissão para editar posts' },     // id 2
    { name: 'delete_post', description: 'Permissão para deletar posts' }, // id 3
    { name: 'create_user', description: 'Permissão para criar usuários' }, // id 4
    { name: 'edit_user', description: 'Permissão para editar usuários' },  // id 5
    { name: 'delete_user', description: 'Permissão para deletar usuários' }, // id 6
    { name: 'view_post', description: 'Permissão para visualizar posts' },  // id 7
  ]);


};
