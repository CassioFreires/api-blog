/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  await knex('polls').del();
  await knex('polls').insert([
    {
      id: 1,
      post_id: 1, // certifique-se que esse post exista
      question: 'What is your favorite programming language?',
      expires_at: '2025-12-31T23:59:59.000Z',
    },
  ]);
};
