const bcrypt = require('bcryptjs');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * @param { import('knex').Knex } knex
 */
module.exports.seed = async function (knex) {
  const password = '123456';

  const passwodAdmin = hashPassword(password);
  const passwodEditor = hashPassword(password);
  const passwodAutor = hashPassword(password);
  const passwodUser = hashPassword(password);

  await knex('users').del();

  await knex('users').insert([
    {
      id: 1,
      name: 'Carlos',
      lastName: 'Silva',
      email: 'carlos.silva@admin.com',
      password_hash: passwodAdmin, // hashed password (exemplo)
      phone: '11999999999',
      bio: 'Administrador do sistema',
      avatarUrl: null,
      isActive: true,
      role_id: 1, // admin
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 2,
      name: 'Mariana',
      lastName: 'Oliveira',
      email: 'mariana.editor@example.com',
      password_hash: passwodEditor,
      phone: '11988888888',
      bio: 'Editora de conteúdos',
      avatarUrl: null,
      isActive: true,
      role_id: 2, // editor
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 3,
      name: 'João',
      lastName: 'Souza',
      email: 'joao.author@example.com',
      password_hash: passwodAutor,
      phone: null,
      bio: 'Autor de posts',
      avatarUrl: null,
      isActive: true,
      role_id: 3, // author
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 4,
      name: 'Ana',
      lastName: 'Costa',
      email: 'ana.user@example.com',
      password_hash: passwodUser,
      phone: null,
      bio: null,
      avatarUrl: null,
      isActive: true,
      role_id: 4, // usuário normal
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }
  ]);
};


