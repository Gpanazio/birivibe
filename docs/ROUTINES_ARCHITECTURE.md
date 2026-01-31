# Módulo Rotina - Arquitetura Completa

## Visão Geral

Sistema completo de gestão de rotinas, hábitos, rituais e objetivos.

---

## 1. ROTINAS (Sequences)

Sequências de passos executados em ordem.

```
Rotina: Manhã Produtiva
├── 06:30 - Acordar (trigger: alarme)
├── 06:35 - Tomar remédios ✓
├── 06:40 - Café da manhã (20min)
├── 07:00 - Meditar (10min)
├── 07:15 - Journaling (5min)
├── 07:20 - Revisar agenda
└── 07:30 - Deep Work Block
```

**Campos:**
- Nome, descrição, ícone, cor
- Tipo: manhã, noite, trabalho, treino, custom
- Dias da semana ativos
- Horário de início (fixo ou flexível)
- Passos ordenados

**Passo da Rotina:**
- Nome, duração estimada
- Tipo: hábito, tarefa, time-block, pausa
- Hábito vinculado (opcional)
- Timer automático
- Checklist interno (sub-passos)

---

## 2. HÁBITOS (Habits)

Ações recorrentes com tracking avançado.

**Tipos:**
- **Boolean** - Fez/não fez
- **Numérico** - Quantidade (2L água, 30 páginas)
- **Timer** - Duração (meditar 10min)

**Frequência:**
- Diário
- X vezes por semana
- Dias específicos (Seg, Qua, Sex)
- Dia sim/dia não
- A cada N dias

**Tracking:**
- Streak atual e recorde
- Habit Score (fórmula Loop)
- Taxa de completude (7d, 30d, all-time)
- Melhor horário de execução

---

## 3. RITUAIS (Rituals)

Rotinas especiais com frequência menor.

**Exemplos:**
- Weekly Review (domingo)
- Monthly Planning (dia 1)
- Quarterly Goals (trimestral)
- Birthday Routine (anual)

**Campos:**
- Frequência: semanal, mensal, trimestral, anual
- Dia/data específica
- Template de checklist
- Notas/reflexões

---

## 4. TIME BLOCKS (Blocos de Tempo)

Blocos de foco para trabalho/atividades.

**Tipos:**
- Deep Work (foco total)
- Shallow Work (tarefas leves)
- Meeting (reuniões)
- Break (pausas)
- Personal (pessoal)

**Campos:**
- Nome, tipo, cor
- Duração padrão
- Projeto vinculado
- Recorrência

---

## 5. CONTEXTOS (Contexts)

Tags de contexto para filtrar atividades.

**Exemplos:**
- @casa, @trabalho, @rua
- @baixa-energia, @alta-energia
- @15min, @30min, @1h (tempo disponível)
- @computador, @celular, @offline

**Uso:**
- Filtrar tarefas por contexto atual
- Sugerir atividades baseado em energia/local

---

## 6. GOALS (Objetivos)

Objetivos de médio/longo prazo.

**Níveis:**
- **Visão** (5+ anos) - Quem quero ser
- **Áreas** - Saúde, Carreira, Relacionamentos, Finanças
- **Goals Anuais** - Objetivos do ano
- **Goals Trimestrais** - OKRs
- **Projetos** - Entregas específicas

**Campos:**
- Nome, descrição
- Área da vida
- Data limite
- Métrica de sucesso
- Hábitos vinculados
- Progresso (%)

---

## 7. AUTOMAÇÕES (Rules)

Triggers e ações automáticas.

**Exemplos:**
```
SE completei "Treino" ENTÃO mostrar "Tomar Whey"
SE são 22:00 ENTÃO iniciar "Rotina Noite"
SE completei todos hábitos do dia ENTÃO +50 XP
SE streak = 7 ENTÃO notificar "1 semana!"
```

**Triggers:**
- Hábito completado
- Horário específico
- Localização (com app mobile)
- Streak atingido
- Meta batida

**Ações:**
- Mostrar hábito/tarefa
- Iniciar rotina
- Enviar notificação
- Adicionar XP/pontos
- Criar log

---

## 8. TEMPLATES

Rotinas e rituais prontos para importar.

**Biblioteca:**
- Morning Routine (Huberman)
- Evening Routine (Wind Down)
- Weekly Review (GTD)
- Deep Work Protocol
- Pomodoro Blocks
- TDAH Morning (simplificado)

---

## Schema Prisma (Adições)

```prisma
// Rotinas
model Routine {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String?
  icon        String?
  color       String   @default("#8b5cf6")
  type        String   // morning, evening, work, workout, custom
  daysOfWeek  String?  // JSON array [0,1,2,3,4,5,6]
  startTime   String?  // "06:30"
  isTemplate  Boolean  @default(false)
  active      Boolean  @default(true)
  
  user  User          @relation(fields: [userId], references: [id])
  steps RoutineStep[]
  logs  RoutineLog[]
}

model RoutineStep {
  id          String  @id @default(cuid())
  routineId   String
  habitId     String? // vincula a um hábito
  name        String
  duration    Int?    // minutos
  order       Int     @default(0)
  type        String  // habit, task, timeblock, break
  isOptional  Boolean @default(false)
  
  routine Routine @relation(fields: [routineId], references: [id], onDelete: Cascade)
  habit   Habit?  @relation(fields: [habitId], references: [id])
}

model RoutineLog {
  id          String   @id @default(cuid())
  routineId   String
  userId      String
  startedAt   DateTime
  completedAt DateTime?
  stepsCompleted Int    @default(0)
  totalSteps  Int
  notes       String?
  
  routine Routine @relation(fields: [routineId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
}

// Contextos
model Context {
  id     String @id @default(cuid())
  userId String
  name   String // @casa, @trabalho
  icon   String?
  color  String?
  
  user   User   @relation(fields: [userId], references: [id])
  habits Habit[] @relation("HabitContexts")
  tasks  Task[]  @relation("TaskContexts")
}

// Goals
model Goal {
  id          String    @id @default(cuid())
  userId      String
  name        String
  description String?
  area        String?   // saúde, carreira, finanças
  type        String    // vision, annual, quarterly, project
  targetDate  DateTime?
  metric      String?   // descrição da métrica
  targetValue Float?
  currentValue Float    @default(0)
  progress    Float     @default(0) // 0-100
  parentId    String?   // goal pai (hierarquia)
  
  user     User    @relation(fields: [userId], references: [id])
  parent   Goal?   @relation("GoalHierarchy", fields: [parentId], references: [id])
  children Goal[]  @relation("GoalHierarchy")
  habits   Habit[] @relation("GoalHabits")
}

// Automações
model Automation {
  id          String  @id @default(cuid())
  userId      String
  name        String
  trigger     String  // JSON: {type, habitId?, time?, streak?}
  action      String  // JSON: {type, targetId?, message?}
  active      Boolean @default(true)
  
  user User @relation(fields: [userId], references: [id])
}

// Rituais (rotinas especiais)
model Ritual {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String?
  frequency   String   // weekly, monthly, quarterly, yearly
  dayOfWeek   Int?     // 0-6 para weekly
  dayOfMonth  Int?     // 1-31 para monthly
  month       Int?     // 1-12 para yearly
  template    String?  // JSON checklist
  
  user User        @relation(fields: [userId], references: [id])
  logs RitualLog[]
}

model RitualLog {
  id          String   @id @default(cuid())
  ritualId    String
  userId      String
  completedAt DateTime @default(now())
  notes       String?
  reflection  String?
  
  ritual Ritual @relation(fields: [ritualId], references: [id])
  user   User   @relation(fields: [userId], references: [id])
}
```

---

## UI/Páginas

```
/routines
├── /routines              # Lista de rotinas
├── /routines/[id]         # Execução da rotina (modo play)
├── /routines/[id]/edit    # Editor da rotina
├── /routines/templates    # Biblioteca de templates

/habits
├── /habits                # Grid de hábitos (atual)
├── /habits/[id]           # Detalhe do hábito com stats

/goals
├── /goals                 # Áreas + objetivos
├── /goals/[id]            # Detalhe do goal

/rituals
├── /rituals               # Lista de rituais
├── /rituals/weekly-review # Weekly review template

/settings/automations      # Gerenciar automações
```

---

## Gamificação (Futuro)

- **XP** por completar hábitos/rotinas
- **Levels** baseado em XP total
- **Achievements** por streaks, metas
- **Daily Quests** - 3 hábitos prioritários
