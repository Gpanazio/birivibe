# BiriVibe OS - TODO

*Lista de tarefas para desenvolvimento. Contexto: Life OS estilo The Sims com gamificação.*

---

## Em Andamento: Módulo de Rotinas

### 1. Seed de Rotinas de Exemplo
Criar em `prisma/seed-routines.ts`:
- **Rotina Matinal** (type: morning): Acordar, Água, Remédios, Skincare, Café
- **Rotina Noturna** (type: evening): Desligar telas, Skincare noite, Leitura, Meditação
- **Rotina de Trabalho** (type: work): Revisar agenda, Deep work 90min, Pausa, Emails
- **Rotina de Treino** (type: workout): Aquecimento, Treino principal, Alongamento, Shake

### 2. Editor de Rotina (`/routines/[id]/edit`)
- Formulário para editar nome, descrição, tipo, dias da semana
- Builder de steps drag-and-drop
- Cada step: nome, duração estimada, opcional linkar a um Habit existente
- Botões: Salvar, Cancelar, Deletar rotina

### 3. Player de Rotina (`/routines/[id]/play`)
- UI step-by-step fullscreen
- Mostrar step atual com timer
- Botões: Completar step, Pular, Pausar
- Barra de progresso
- Ao finalizar: salvar RoutineLog com stepsCompleted

### 4. Navegação
- Adicionar link "Rotinas" no sidebar/menu principal
- Ícone: Clock ou ListChecks

---

## Próximos Módulos

### 5. Dashboard Principal (`/dashboard`)
- Barras de necessidade estilo Sims:
  - Energia (baseado em SleepLog)
  - Saúde (baseado em exercício + peso)
  - Humor (baseado em MoodLog)
  - Fome (inverso do tempo desde última refeição)
- Buffs do dia: +Treino, +Remédios, +Meditação (tags visuais)
- Widget de rotinas do dia

### 6. Neural Input (`/biri`)
- Terminal para "Daily Dump" em texto livre
- Enviar para Gemini processar e extrair:
  - Humor do dia
  - Refeições mencionadas
  - Atividades/exercícios
  - Hábitos completados
- Salvar nos respectivos logs automaticamente

### 7. Integração wger (Exercícios)
- Buscar exercícios da API: `https://wger.de/api/v2/exercise/`
- Permitir adicionar exercícios às rotinas de treino
- Mostrar instruções e músculos trabalhados

---

## Melhorias Técnicas

### 8. Habit Score (Loop Habit Tracker)
- Implementar fórmula de score baseada em frequência e consistência
- Mostrar score na página de hábitos

### 9. Contexts e Goals
- Criar páginas `/contexts` e `/goals`
- Linkar rotinas a contextos (Casa, Trabalho, Academia)
- Definir objetivos com métricas e progresso

### 10. Automations
- Criar página `/automations`
- Triggers: horário, localização, completion de rotina
- Actions: notificação, iniciar rotina, log automático

---

## Estética

- Fundo OLED black (#000)
- Acentos: lime (#84cc16), purple (#8b5cf6)
- Barras de necessidade com gradientes e animação pulse quando baixas
- Tipografia: monospace para dados, sans para UI

---

*Stack: Next.js 14, Prisma, SQLite, Gemini 2.5 Flash Lite*
*Repo: https://github.com/Gpanazio/birivibe*
