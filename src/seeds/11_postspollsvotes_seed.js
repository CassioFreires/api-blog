/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  await knex('poll_votes').del();
  await knex('poll_votes').insert([
    {
      id: 1,
      user_id: 1, // certifique-se que esse usuário exista
      poll_option_id: 2,
      poll_id: 1, // adicionei o poll_id para respeitar a constraint
      created_at: new Date(),
    },
  ]);
};