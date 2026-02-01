# TASK PART 1: RoutineCard Expansível

## Objetivo
Refatorar o componente RoutineCard para ser expansível tipo acordeão, mostrando steps como checklist.

## Remover
- Botão Play e prop `onStart`
- Não precisa mais redirecionar pra `/routines/[id]/play`

## Adicionar

### Estado
```tsx
const [expanded, setExpanded] = useState(false);
```

### Layout do Card
```tsx
<div className="routine-card">
  {/* Header - sempre visível, clicável */}
  <div 
    className="header cursor-pointer" 
    onClick={() => setExpanded(!expanded)}
  >
    <Icon />
    <div>
      <h3>{routine.name}</h3>
      <span>{routine.steps.length} passos • {totalDuration}min • {routine.startTime}</span>
    </div>
    <ChevronDown className={expanded ? 'rotate-180' : ''} />
    <OptionsMenu /> {/* já existe e funciona */}
  </div>
  
  {/* Steps - só visível quando expanded */}
  {expanded && (
    <div className="steps-list px-4 pb-4 space-y-2">
      {routine.steps.map(step => (
        <div 
          key={step.id}
          className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800"
        >
          <input 
            type="checkbox" 
            className="w-5 h-5"
            // TODO: lógica de toggle vem depois
          />
          <span className="text-2xl">{step.icon || '📝'}</span>
          <div className="flex-1">
            <span className="text-white">{step.name}</span>
            {step.isOptional && (
              <span className="ml-2 text-xs text-zinc-500">(opcional)</span>
            )}
          </div>
          {step.duration && (
            <span className="text-xs text-zinc-500">{step.duration}min</span>
          )}
        </div>
      ))}
    </div>
  )}
</div>
```

## Retorne APENAS
O código completo da função `RoutineCard` refatorada. Use Tailwind classes. Mantenha o menu de opções funcionando (já está correto com modal centralizado).
