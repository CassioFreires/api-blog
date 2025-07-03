# 🚀 Blog MVP Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

---

## 📋 Sobre o Projeto

Backend do **Blog MVP** — uma API RESTful desenvolvida com **Node.js**, **TypeScript** e **TypeORM** para PostgreSQL.  
Projetada com foco em **Clean Code** e **Clean Architecture**, oferecendo uma base sólida para um blog escalável e moderno.

Este MVP contempla funcionalidades essenciais e será evoluído para suportar alta performance e escalabilidade.

---

## ✨ Funcionalidades

- 🔐 Autenticação JWT com suporte a 2FA (Two-Factor Authentication)  
- 📝 Cadastro e login com validação robusta via Zod  
- 👥 Sistema de roles e permissões para controle de acesso  
- 📰 CRUD de posts, likes e comentários  
- 🏗️ Estrutura modularizada (Controller, Service, Repository)  
- ⚙️ Configuração via variáveis de ambiente (.env)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia       | Descrição                          |
| ---------------- | ---------------------------------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js)         | Plataforma backend JavaScript     |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript) | Superset de JS para tipagem estática |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express)       | Framework web minimalista         |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql) | Banco de dados relacional         |
| ![TypeORM](https://img.shields.io/badge/-TypeORM-3178C6?style=flat-square)                     | ORM para TypeScript/JavaScript    |
| ![Zod](https://img.shields.io/badge/-Zod-6332F6?style=flat-square)                             | Validação de esquema de dados     |
| JWT               | Autenticação via tokens            |
| Bcrypt            | Hash de senhas                    |
| Dotenv            | Variáveis de ambiente             |

---

## 🚀 Instalação e Execução

1. Clone o repositório:
    ```bash
    git clone https://github.com/seuusuario/blog-mvp-backend.git
    cd blog-mvp-backend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` e configure suas variáveis:
    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=SuaSenhaAqui
    DB_DATABASE=blog
    DB_SYNCHRONIZE=true
    DB_LOGGING=false

    JWT_PRIVATE_ACCESS_TOKEN_KEY=SuaChaveSecretaAqui
    JWT_PRIVATE_KEY_REFRESH_TOKEN=SuaChaveSecretaAqui
    ```

4. Execute o projeto em modo desenvolvimento:
    ```bash
    npm run dev
    ```

5. Acesse a API em `http://localhost:3000`

---

## 🔍 Estrutura do Projeto

src/
├── modules/
│ ├── auth/
│ ├── user/
│ ├── post/
│ ├── comment/
│ ├── like/
│ ├── role/
│ ├── permission/
│ └── rolePermission/
├── config/
├── database/
├── middlewares/
├── utils/
├── server.ts
└── app.ts


---

## 📈 Roadmap para Escalabilidade

1. **Microserviços**: Separar auth, posts e usuários para serviços independentes  
2. **Banco de dados**: Índices, particionamento, réplicas para leitura  
3. **Cache Redis**: Cache para endpoints críticos  
4. **Filas**: Processamento assíncrono (ex: notificações)  
5. **Segurança**: Rate limiting, helmet, blacklist de JWT  
6. **Deploy**: Docker + Load Balancer + Kubernetes  
7. **Monitoramento**: Prometheus, Grafana, Sentry  
8. **Testes automatizados**: Unitários, integração e E2E com CI/CD  
9. **DDD + Eventual Consistency** para arquitetura robusta

---

## 🤝 Contribuição

Contribuições são bem-vindas!  

Por favor, abra issues para bugs ou melhorias e crie pull requests seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/).

---

## 📄 Licença

MIT © Cassio Souza

---

## 📬 Contato

Cassio Souza — [cassio.email@exemplo.com](mailto:cassio.email@exemplo.com)  
[LinkedIn](https://www.linkedin.com/in/cassiosouza) | [GitHub](https://github.com/cassiosouza)

---

> *README gerado e estruturado para máxima clareza e organização no GitHub.*  
