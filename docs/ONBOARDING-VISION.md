# BiriVibe - Onboarding Geral

## Conceito
O onboarding do BiriVibe é **modular e personalizado**. O usuário não precisa usar todos os recursos - ele escolhe o que faz sentido pra sua vida.

---

## Fluxo de Onboarding

### 1. Boas-vindas
```
"Olá! Eu sou o [Assistente BiriVibe].
Vou te ajudar a organizar sua vida do seu jeito.
Primeiro, me conta: o que você quer melhorar?"
```

### 2. Seleção de Módulos
O usuário escolhe quais áreas quer controlar:

| Módulo | Descrição | Ícone |
|--------|-----------|-------|
| Rotinas | Organizar o dia com blocos de atividades | 🌅 |
| Hábitos | Acompanhar hábitos diários | ✅ |
| Dieta | Controlar alimentação e nutrição | 🍎 |
| Metas | Definir e acompanhar objetivos | 🎯 |
| Foco | Sessões de trabalho concentrado | 🧠 |
| Finanças | Controle financeiro pessoal | 💰 |

**Regras:**
- Mínimo 1 módulo
- Pode adicionar mais depois
- Pode desativar a qualquer momento

### 3. Configuração por Módulo
Para cada módulo ativado, perguntas específicas:

**Rotinas:**
- "Que horas você acorda normalmente?"
- "Trabalha em casa ou escritório?"
- "Pratica exercícios? Quantas vezes por semana?"

**Hábitos:**
- "Tem algum hábito que quer criar ou eliminar?"
- "Prefere check-in diário ou semanal?"

**Dieta:**
- "Tem alguma restrição alimentar?"
- "Quer contar calorias ou só registrar refeições?"

### 4. Preferências Gerais
```
"Como você prefere usar o BiriVibe?"

[ ] Detalhado - Quero controlar tudo em detalhe
[ ] Equilibrado - Controle moderado
[ ] Simples - Só o essencial

"Quer receber lembretes?"
[ ] Sim, sempre
[ ] Só importantes
[ ] Não, vou lembrar sozinho
```

### 5. Geração Personalizada
Com base nas respostas, o **LLM gera**:
- Rotinas sugeridas (se módulo ativo)
- Hábitos recomendados (se módulo ativo)
- Dashboard personalizado
- Menu simplificado (só módulos ativos)

### 6. Revisão e Ajuste
```
"Pronto! Montei uma sugestão pra você.
Dá uma olhada e ajusta o que quiser."

[Ver Rotinas] [Ver Hábitos] [Tudo certo, começar!]
```

---

## Impacto na UI

### Menu/Navegação
Só mostra módulos ativos:
```
// Usuário ativou: Rotinas + Hábitos
├── 🏠 Home
├── 🌅 Rotinas
├── ✅ Hábitos
└── ⚙️ Configurações

// Usuário ativou: Tudo
├── 🏠 Home
├── 🌅 Rotinas
├── ✅ Hábitos
├── 🍎 Dieta
├── 🎯 Metas
├── 🧠 Foco
└── ⚙️ Configurações
```

### Dashboard
Adapta baseado nos módulos:
- Cards só dos módulos ativos
- Métricas relevantes
- Sugestões contextuais

### Configurações
Opção de ativar/desativar módulos a qualquer momento.

---

## Dados Salvos

```ts
interface UserPreferences {
  activeModules: ('routines' | 'habits' | 'diet' | 'goals' | 'focus' | 'finance')[];
  detailLevel: 'detailed' | 'balanced' | 'simple';
  notifications: 'all' | 'important' | 'none';
  onboardingCompleted: boolean;
  onboardingData: Record<string, any>; // respostas do onboarding
}
```

---

## Notas
- O assistente do app terá nome/marca própria (NÃO é "Douglas")
- LLM usado para gerar sugestões personalizadas
- Usuário sempre pode pular e configurar depois

---

*Atualizado: 2026-02-01*
