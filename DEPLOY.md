# Deploy no Cloudflare Pages

Guia para deploy do BiriVibe OS no Cloudflare Pages com D1 (SQLite).

## Pré-requisitos

1. Conta no Cloudflare (gratuita)
2. Wrangler CLI instalado: `npm install -g wrangler`
3. Login no Cloudflare: `npx wrangler login`

---

## 1. Criar Banco D1

```bash
# Criar o banco de dados D1
npx wrangler d1 create birivibe-db

# Copie o ID gerado e atualize wrangler.toml
# database_id = "SEU_ID_AQUI"
```

## 2. Gerar SQL de Migração

```bash
# Gerar o SQL a partir do schema Prisma
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0001_init.sql
```

## 3. Aplicar Migração no D1

```bash
# Local (para desenvolvimento)
npx wrangler d1 execute birivibe-db --local --file=prisma/migrations/0001_init.sql

# Produção (Cloudflare)
npx wrangler d1 execute birivibe-db --remote --file=prisma/migrations/0001_init.sql
```

## 4. Variáveis de Ambiente

No painel do Cloudflare Pages, adicione:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | `file:./dev.db` (ignorado em prod) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://seu-projeto.pages.dev` |

---

## 5. Build e Deploy

### Opção A: Via Dashboard do Cloudflare

1. Vá em **Pages** > **Create a project**
2. Conecte seu repositório GitHub
3. Configure:
   - **Build command:** `npm run pages:build`
   - **Build output:** `.vercel/output/static`
   - **Node version:** `20`

### Opção B: Via CLI

```bash
# Build
pnpm install
pnpm run pages:build

# Deploy
pnpm run pages:deploy
```

---

## 6. Configuração do wrangler.toml

```toml
name = "birivibe"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[vars]
NODE_ENV = "production"

[[d1_databases]]
binding = "DB"
database_name = "birivibe-db"
database_id = "SEU_D1_DATABASE_ID"
```

---

## Desenvolvimento Local com D1

```bash
# Criar banco local
npx wrangler d1 execute birivibe-db --local --file=prisma/migrations/0001_init.sql

# Rodar em modo preview
pnpm run pages:dev
```

---

## Estrutura de Arquivos

```
birivibe/
├── wrangler.toml          # Config Cloudflare
├── next.config.js         # Config Next.js (standalone)
├── prisma/
│   ├── schema.prisma      # Schema com driverAdapters
│   └── migrations/
│       └── 0001_init.sql  # SQL para D1
├── lib/
│   └── db.ts              # Cliente Prisma com adapter D1
└── env.d.ts               # Tipos Cloudflare
```

---

## Troubleshooting

### Erro: "D1 not available"
Certifique-se que `nodejs_compat` está nos `compatibility_flags`.

### Erro: "Cannot find module '@prisma/adapter-d1'"
Execute: `pnpm install @prisma/adapter-d1`

### Build falha com "Edge Runtime"
Verifique se `output: 'standalone'` está no `next.config.js`.

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Dev local (SQLite) |
| `pnpm pages:build` | Build para Cloudflare |
| `pnpm pages:dev` | Dev com D1 local |
| `pnpm pages:deploy` | Deploy para produção |
| `pnpm d1:create` | Criar banco D1 |
| `pnpm d1:migrate` | Migrar D1 local |
| `pnpm d1:migrate:prod` | Migrar D1 produção |
