/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  // Limpa registros antigos
  await knex('categories').del();

  // Insere categorias padrão
  await knex('categories').insert([
    {
      name: 'Tecnologia',
      slug: 'tecnologia',
      description: 'Novidades e tendências do mundo da tecnologia, desenvolvimento de software e inovação digital.'
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'Inspiração e técnicas de design gráfico, UX/UI e criação visual para produtos e experiências.'
    },
    {
      name: 'Negócios',
      slug: 'negocios',
      description: 'Insights e estratégias de negócios, gestão, empreendedorismo e crescimento empresarial.'
    },
    {
      name: 'Mobile',
      slug: 'mobile',
      description: 'Tudo sobre desenvolvimento mobile, apps, tendências para iOS e Android e experiências móveis.'
    },
    {
      name: 'IA',
      slug: 'ia',
      description: 'Inteligência Artificial, machine learning, automação e inovações que transformam o futuro.'
    },
    {
      name: 'Carreira',
      slug: 'carreira',
      description: 'Dicas e orientações para desenvolvimento profissional, habilidades e crescimento na carreira.'
    }
  ]);
};
