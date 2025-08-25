/**
 * @param {import('knex').Knex} knex
 */

exports.seed = async function (knex) {
  await knex('permissions').del();

  await knex('permissions').insert([
    // Posts
    { name: 'create_post', description: 'Criar posts' },
    { name: 'edit_own_post', description: 'Editar seus próprios posts' },
    { name: 'delete_own_post', description: 'Deletar seus próprios posts' },
    { name: 'edit_any_post', description: 'Editar qualquer post' },
    { name: 'delete_any_post', description: 'Deletar qualquer post' },

    // Comentários
    { name: 'create_comment', description: 'Criar comentários' },
    { name: 'edit_own_comment', description: 'Editar seus próprios comentários' },
    { name: 'delete_own_comment', description: 'Deletar seus próprios comentários' },
    { name: 'delete_any_comment', description: 'Deletar qualquer comentário' },

    // Usuário
    { name: 'edit_profile', description: 'Editar seu próprio perfil' },
    { name: 'manage_users', description: 'Gerenciar todos os usuários' }
  ]);

}

