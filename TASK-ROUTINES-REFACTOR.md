# TASK: Refatorar Módulo de Rotinas do BiriVibe

## Contexto
O módulo de rotinas atual tem problemas de UX e arquitetura. Precisa ser completamente refatorado.

## Problemas Atuais
1. Templates são rotinas isoladas - não há visão de "dia inteiro"
2. Botão "Play" força modo de execução - usuário não vê steps sem dar play
3. Não dá pra ver os itens da rotina sem entrar em modo execução
4. Menu dropdown de opções estava cortado (já corrigido com modal centralizado)

## Nova Arquitetura Desejada

### 1. Estrutura de Dia (DayPlan)
- Um "Dia" é a estrutura principal, dividido em **blocos de tempo**
- Blocos padrão: Manhã (06:00-12:00), Tarde (12:00-18:00), Noite (18:00-23:00)
- Templates preenchem blocos específicos
- Usuário pode ter múltiplos "tipos de dia": Dia de Trabalho, Fim de Semana, etc.

### 2. Cards Expansíveis (Acordeão)
- Clica no card → Expande e mostra todos os steps
- Sem botão "Play" - remove completamente
- Mostra progress bar no card indicando % completado

### 3. Checklist Direto
- Clica no step → Marca como feito ✅
- Sem modal de execução, sem fricção
- Steps opcionais ficam com visual diferenciado

## Mudanças Necessárias

### Arquivo: `app/routines/page.tsx`

#### Remover:
- Botão Play e toda lógica de `onStart`
- Link para `/routines/[id]/play`
- Modo de execução

#### Adicionar:
- Estado `expandedRoutine` para controlar qual card está expandido
- Ao clicar no card, expande mostrando todos os steps como checklist
- Checkbox em cada step que marca como completo
- Progress bar visual no header do card
- Seção de "Blocos do Dia" agrupando rotinas por período

#### Novo Layout do Card:
```tsx
<div className="routine-card">
  {/* Header - sempre visível */}
  <div className="header" onClick={() => toggleExpand(routine.id)}>
    <Icon />
    <div>
      <h3>{routine.name}</h3>
      <span>{completedSteps}/{totalSteps} • {routine.startTime}</span>
    </div>
    <ProgressBar value={completedSteps/totalSteps} />
    <ChevronDown className={expanded ? 'rotate-180' : ''} />
    <OptionsMenu /> {/* Editar, Excluir */}
  </div>
  
  {/* Steps - visível quando expandido */}
  {expanded && (
    <div className="steps-list">
      {routine.steps.map(step => (
        <div className="step-item" onClick={() => toggleStep(step.id)}>
          <Checkbox checked={step.completed} />
          <span className="icon">{step.icon}</span>
          <span className="name">{step.name}</span>
          <span className="duration">{step.duration}min</span>
          {step.isOptional && <Badge>opcional</Badge>}
        </div>
      ))}
    </div>
  )}
</div>
```

### Arquivo: `app/api/routines/route.ts`
- Adicionar endpoint para marcar step como completo
- Salvar progresso diário (qual step foi feito hoje)

### Novo Arquivo: `app/api/routines/[id]/steps/[stepId]/toggle/route.ts`
```ts
// POST - toggle step completion for today
export async function POST(req, { params }) {
  const { id: routineId, stepId } = params;
  const today = new Date().toISOString().split('T')[0];
  
  // Busca ou cria log do dia
  let log = await db.routineLog.findFirst({
    where: { routineId, startedAt: { gte: new Date(today) } }
  });
  
  if (!log) {
    log = await db.routineLog.create({
      data: { routineId, userId, totalSteps: routine.steps.length }
    });
  }
  
  // Toggle step no array de completados
  const completed = JSON.parse(log.stepsCompleted || '[]');
  const index = completed.indexOf(stepId);
  if (index > -1) {
    completed.splice(index, 1);
  } else {
    completed.push(stepId);
  }
  
  await db.routineLog.update({
    where: { id: log.id },
    data: { stepsCompleted: JSON.stringify(completed) }
  });
  
  return NextResponse.json({ completed });
}
```

### Schema Prisma (já existe, usar como está)
- `RoutineLog` já tem `stepsCompleted` como JSON string
- Não precisa migração

## Templates Como Blocos

Os templates existentes devem continuar funcionando, mas agora são vistos como "presets" para preencher blocos do dia:

- **Manhã Produtiva** → Bloco Manhã
- **Noite de Descanso** → Bloco Noite  
- **Deep Work** → Bloco Tarde
- **Treino Completo** → Bloco Extra (horário flexível)
- **Domingo Regenerativo** → Tipo de Dia especial

## Arquivos para Modificar
1. `app/routines/page.tsx` - Refatoração completa do componente
2. `app/api/routines/[id]/steps/[stepId]/toggle/route.ts` - Novo endpoint
3. Remover ou deprecar: `app/routines/[id]/play/page.tsx`

## Prioridade
1. Primeiro: Cards expansíveis com checklist (maior impacto UX)
2. Segundo: API de toggle step
3. Terceiro: Estrutura de blocos do dia (pode ser fase 2)

## Resultado Esperado
- Usuário abre /routines
- Vê suas rotinas como cards compactos com progress bar
- Clica em um card → expande mostrando todos os steps
- Clica em um step → marca/desmarca como feito
- Menu de opções (⋮) permite Editar ou Excluir
- Sem botão Play, sem modo de execução forçado
