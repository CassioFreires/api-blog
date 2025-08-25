const bcrypt = require('bcryptjs');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  const password = '123456';
  const passwodAdmin = hashPassword(password);
  const passwodEditor = hashPassword(password);
  const passwodAutor = hashPassword(password);
  const passwodUser = hashPassword(password);

  await knex('users').del();

  await knex('users').insert([
    {
      name: 'Carlos',
      lastName: 'Silva',
      email: 'carlos.silva@admin.com',
      password_hash: passwodAdmin,
      phone: '11999999999',
      bio: 'Administrador do sistema',
      avatarUrl: null,
      isActive: true,
      role_id: 1,
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Mariana',
      lastName: 'Oliveira',
      email: 'mariana.editor@example.com',
      password_hash: passwodEditor,
      phone: '11988888888',
      bio: 'Editora de conteúdos',
      avatarUrl: null,
      isActive: true,
      role_id: 2,
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'João',
      lastName: 'Souza',
      email: 'joao.author@example.com',
      password_hash: passwodAutor,
      phone: null,
      bio: 'Autor de posts',
      avatarUrl: null,
      isActive: true,
      role_id: 3,
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Ana',
      lastName: 'Costa',
      email: 'ana.user@example.com',
      password_hash: passwodUser,
      phone: null,
      bio: null,
      avatarUrl: null,
      isActive: true,
      role_id: 4,
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
};
