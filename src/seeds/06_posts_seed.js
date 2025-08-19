/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  
  await knex('posts').del();

  const categories = await knex('categories').select('id');
  const categoryIds = categories.map(cat => cat.id);

  const userIds = [1, 2, 3, 4];

  const posts = [];

  for (let i = 1; i <= 50; i++) {
    const userId = userIds[i % userIds.length]; // alterna entre os usuários
    const categoryId = categoryIds[i % categoryIds.length]; // alterna entre categorias

    posts.push({
      title: `Título do Post ${i}`,
      subtitle: `Subtítulo do Post ${i}`,
      content: `Este é o conteúdo detalhado do post número ${i}. Conteúdo de teste para simular um ambiente real e testar performance.`,
      user_id: userId,
      category_id: categoryId, // ✅ relacionamento com a categoria
      createAt: new Date(),
      updatAt: new Date(),
      delatAt: null,
    });
  }

  await knex('posts').insert(posts);
};
