/**
 * @param {import('knex').Knex} knex
 */

exports.seed = async function (knex) {
  await knex('role_permissions').del();

  // Admin -> todas permissões
  const allPermissions = await knex('permissions').pluck('id');
  const adminPerms = allPermissions.map(pid => ({ role_id: 1, permission_id: pid }));

  // Editor -> gerencia posts/comentários de qualquer um
  const editorPerms = [
    { role_id: 2, permission_id: 1 }, // create_post
    { role_id: 2, permission_id: 4 }, // edit_any_post
    { role_id: 2, permission_id: 5 }, // delete_any_post
    { role_id: 2, permission_id: 6 }, // create_comment
    { role_id: 2, permission_id: 9 }, // delete_any_comment
  ];

  // Author -> gerencia seus próprios posts e comentários
  const authorPerms = [
    { role_id: 3, permission_id: 1 }, // create_post
    { role_id: 3, permission_id: 2 }, // edit_own_post
    { role_id: 3, permission_id: 3 }, // delete_own_post
    { role_id: 3, permission_id: 6 }, // create_comment
    { role_id: 3, permission_id: 7 }, // edit_own_comment
    { role_id: 3, permission_id: 8 }, // delete_own_comment
    { role_id: 3, permission_id: 10 }, // edit_profile
  ];

  // User -> só comentários e perfil
  const userPerms = [
    { role_id: 4, permission_id: 6 }, // create_comment
    { role_id: 4, permission_id: 7 }, // edit_own_comment
    { role_id: 4, permission_id: 8 }, // delete_own_comment
    { role_id: 4, permission_id: 10 }, // edit_profile
  ];

  await knex('role_permissions').insert([
    ...adminPerms,
    ...editorPerms,
    ...authorPerms,
    ...userPerms
  ]);

}
