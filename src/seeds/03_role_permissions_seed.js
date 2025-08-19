/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  await knex('role_permissions').del();

  await knex('role_permissions').insert([
    // Admin tem todas as permissões
    { role_id: 1, permission_id: 1 },
    { role_id: 1, permission_id: 2 },
    { role_id: 1, permission_id: 3 },
    { role_id: 1, permission_id: 4 },
    { role_id: 1, permission_id: 5 },
    { role_id: 1, permission_id: 6 },

    // Editor pode criar e editar posts
    { role_id: 2, permission_id: 1 },
    { role_id: 2, permission_id: 2 },

    // Author pode criar posts (exemplo)
    { role_id: 3, permission_id: 1 },

    // Usuário normal pode apenas visualizar posts
    { role_id: 4, permission_id: 7 }, // assumindo que 'view_post' é a 7ª permissão inserida
  ]);
};
