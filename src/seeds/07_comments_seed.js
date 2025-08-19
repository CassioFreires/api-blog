/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  // Limpa os dados existentes
  await knex('comments').del();

  const comments = [];

  // IDs de usuários e posts para distribuição
  const userIds = [1, 2, 3, 4];
  const postCount = 50; // assumindo 50 posts criados no seed anterior

  for (let i = 1; i <= 150; i++) { // 150 comentários para testar
    const userId = userIds[i % userIds.length];
    const postId = (i % postCount) + 1;

    comments.push({
      content: `Comentário número ${i}, escrito pelo usuário ${userId} no post ${postId}.`,
      post_id: postId,
      user_id: userId,
      createAt: new Date(),
      updateAt: new Date()
    });
  }

  await knex('comments').insert(comments);
};
