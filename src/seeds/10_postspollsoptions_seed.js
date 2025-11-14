/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  await knex('poll_options').del();
  await knex('poll_options').insert([
    { id: 1, poll_id: 1, text: 'JavaScript', votes: 0 },
    { id: 2, poll_id: 1, text: 'Python', votes: 0 },
    { id: 3, poll_id: 1, text: 'Java', votes: 0 },
    { id: 4, poll_id: 1, text: 'C#', votes: 0 },
  ]);
};
