#!/bin/bash
# Script de setup para Railway
# Executa migração e build automaticamente

echo "🚀 Iniciando setup do BiriVibe no Railway..."

# Verifica se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERRO: DATABASE_URL não está definida"
  exit 1
fi

echo "📊 Executando migrações do Prisma..."
npx prisma db push --accept-data-loss || {
  echo "⚠️  Aviso: Algumas migrações podem ter falhado, continuando..."
}

echo "🔨 Gerando Prisma Client..."
npx prisma generate

echo "🏗️  Buildando aplicação Next.js..."
npm run build

echo "✅ Setup completo!"
