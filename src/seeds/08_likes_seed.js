/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  // Limpa os dados existentes
  await knex('likes').del();

  const likes = [];

  // IDs de usuários e posts para distribuição
  const userIds = [1, 2, 3, 4];
  const postCount = 50; // assumindo 50 posts

  // Simular cerca de 200 likes aleatórios
  for (let i = 1; i <= 200; i++) {
    const userId = userIds[i % userIds.length];
    const postId = (i * 3) % postCount + 1; // distribui curtidas por posts de forma variada

    likes.push({
      post_id: postId,
      user_id: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Remover duplicatas (mesmo post_id e user_id) para evitar violar a constraint unique
  const uniqueLikes = [];
  const seen = new Set();

  for (const like of likes) {
    const key = `${like.post_id}-${like.user_id}`;
    if (!seen.has(key)) {
      uniqueLikes.push(like);
      seen.add(key);
    }
  }

  await knex('likes').insert(uniqueLikes);
};
