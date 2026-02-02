# Deploy no Railway

## Configuração

### 1. Crie o projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Escolha "Deploy from GitHub repo"
4. Selecione o repositório do BiriVibe

### 2. Adicione o PostgreSQL

1. No projeto Railway, clique em "New"
2. Selecione "Database" → "Add PostgreSQL"
3. Aguarde a criação do banco

### 3. Configure as Variáveis de Ambiente

No painel do projeto Railway, vá em "Variables" e adicione:

```
NODE_ENV=production
NEXTAUTH_SECRET=<<Generate a random secret (use: openssl rand -base64 32)>>
NEXTAUTH_URL=<<Your Railway domain (https://your-app.up.railway.app)>>
DATABASE_URL=<<Copie da variável do PostgreSQL>>
```

Opcional (para login com OAuth):

```
GOOGLE_CLIENT_ID=<<Seu ID do Google>>
GOOGLE_CLIENT_SECRET=<<Seu Secret do Google>>
```

### 4. Deploy

O Railway vai fazer deploy automaticamente após o push para o GitHub.

Para deploy manual:

```bash
railway login
railway link
railway up
```

### 5. Execute as Migrações

Após o primeiro deploy, execute:

```bash
railway run npx prisma migrate deploy
```

Ou via interface web do Railway:

1. Vá em "Deployments"
2. Clique nos "..." do deploy atual
3. Selecione "Run Command"
4. Execute: `npx prisma migrate deploy`

### 6. Crie o primeiro usuário

A autenticação está configurada para usar CredentialsProvider (modo dev simplificado).
Para criar um usuário, você precisará inserir diretamente no banco ou configurar OAuth.

Para inserir via Railway:

```bash
railway run npx prisma studio
```

Ou use o comando SQL:

```sql
INSERT INTO "User" (id, name, email, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Seu Nome', 'seu@email.com', NOW(), NOW());
```

## Comandos Úteis

```bash
# Ver logs
railway logs

# Abrir Prisma Studio
railway run npx prisma studio

# Executar migrações
railway run npx prisma migrate deploy

# Gerar cliente Prisma
railway run npx prisma generate
```

## Troubleshooting

### Erro de conexão com banco

- Verifique se DATABASE_URL está configurada
- Confirme que o PostgreSQL está provisionado

### Build falha

- Verifique se todas as dependências estão instaladas
- Execute `npm run build` localmente para testar

### Migrações não aplicam

- Execute manualmente via Railway Console
- Ou use: `railway run npx prisma migrate deploy`

## Diferenças do Cloudflare

- **Banco**: PostgreSQL (Railway) vs D1 (Cloudflare)
- **Runtime**: Node.js padrão vs Edge Runtime
- **Prisma**: Client padrão vs Adapter D1
- **Deploy**: Container tradicional vs Cloudflare Workers
