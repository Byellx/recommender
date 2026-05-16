# Post Recommender API

API REST de uma plataforma de posts com sistema de recomendação baseado nos interesses do usuário (em desenvolvimento). Construída com NestJS, TypeScript, Prisma e PostgreSQL.

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Criação, publicação e arquivamento de posts por categoria
- Feed de posts publicados com contagem de curtidas e comentários
- Sistema de curtidas (like/unlike toggle)
- Comentários com suporte a respostas aninhadas
- Controle de acesso: apenas o autor pode editar, publicar, arquivar ou deletar seus posts
- Rotas públicas e autenticadas coexistindo no mesmo endpoint via `OptionalJwtAuthGuard`

## Tecnologias

- [NestJS](https://nestjs.com/) — framework Node.js
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/) com PostgreSQL
- [Passport](https://www.passportjs.org/) + JWT para autenticação
- [bcrypt](https://www.npmjs.com/package/bcrypt) para hash de senhas
- [class-validator](https://github.com/typestack/class-validator) para validação de entrada

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou em nuvem

## Configuração

1. Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
npm install
```

2. Crie um arquivo `.env` na raiz com as variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="7d"
```

3. Execute as migrations do banco:

```bash
npx prisma migrate deploy
```

4. Inicie o servidor:

```bash
# desenvolvimento
npm run start:dev

# produção
npm run start:prod
```

O servidor sobe na porta `3000` por padrão.

## Endpoints principais

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/users` | Cadastrar usuário | — |
| `POST` | `/auth/login` | Login, retorna JWT | — |
| `GET` | `/auth/me` | Dados do usuário autenticado | ✓ |

### Posts

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/posts/feed` | Feed de posts publicados | Opcional |
| `GET` | `/posts/:id` | Detalhes de um post | Opcional |
| `POST` | `/posts` | Criar post (status: DRAFT) | ✓ |
| `PATCH` | `/posts/:id/update` | Editar post | ✓ |
| `PATCH` | `/posts/:id/publish` | Publicar post | ✓ |
| `PATCH` | `/posts/:id/archive` | Arquivar post | ✓ |
| `DELETE` | `/posts/:id` | Deletar post | ✓ |

### Curtidas e Comentários

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/reaction/:postId` | Curtir / descurtir post | ✓ |
| `GET` | `/comment/:postId` | Listar comentários de um post | ✓ |
| `POST` | `/comment/:postId` | Comentar em um post | ✓ |
| `PATCH` | `/comment/:commentId` | Editar comentário | ✓ |
| `DELETE` | `/comment/:commentId` | Deletar comentário | ✓ |

> Comentários suportam respostas aninhadas via campo `parentId`.

## Roadmap

- [ ] Algoritmo de recomendação baseado em curtidas e categorias seguidas
- [ ] Paginação no feed
- [ ] Busca por posts
- [ ] Frontend

## Testes

```bash
# unitários
npm run test

# e2e
npm run test:e2e

# cobertura
npm run test:cov
```