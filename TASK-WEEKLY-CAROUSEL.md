# TASK: Navegação Semanal em Carousel

## Objetivo
Substituir a listagem vertical de rotinas por um **carousel horizontal** onde cada "slide" é um dia da semana. O usuário navega com swipe ou botões.

## Estrutura Visual

```
        ← Segunda-feira →
       [●○○○○○○] (dots)
    
    ┌─────────────────────────┐
    │                         │
    │   🌅 Manhã Produtiva    │
    │   ├─ Acordar 6h         │
    │   ├─ Meditação          │
    │   └─ Café               │
    │                         │
    │   💼 Deep Work          │
    │   ├─ Bloco 1 (9h)       │
    │   └─ Bloco 2 (14h)      │
    │                         │
    │   🌙 Noite              │
    │   └─ Relaxamento        │
    │                         │
    │   [+ Adicionar Bloco]   │
    │                         │
    └─────────────────────────┘
          ← swipe →
```

## Modelo de Dados

### WeeklyRoutine
```ts
interface DayRoutine {
  dayOfWeek: number; // 0=domingo, 1=segunda, ..., 6=sábado
  routines: Routine[]; // rotinas daquele dia
}

// No banco: Routine já tem campo daysOfWeek (JSON array)
// Exemplo: daysOfWeek: "[1,2,3,4,5]" = seg-sex
```

### Estado do Componente
```ts
const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // dia atual
const [touchStart, setTouchStart] = useState(0);

// Filtra rotinas do dia selecionado
const dayRoutines = routines.filter(r => {
  const days = r.daysOfWeek ? JSON.parse(r.daysOfWeek) : [0,1,2,3,4,5,6];
  return days.includes(selectedDay);
});
```

## Componentes

### 1. DaySelector (header com nome do dia + navegação)
```tsx
const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function DaySelector({ selected, onChange }: { selected: number; onChange: (day: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button 
        onClick={() => onChange((selected - 1 + 7) % 7)}
        className="p-2 hover:bg-zinc-800 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{DAYS[selected]}</h2>
        <div className="flex gap-1 justify-center mt-2">
          {DAYS.map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === selected ? 'bg-purple-500' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => onChange((selected + 1) % 7)}
        className="p-2 hover:bg-zinc-800 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
```

### 2. DayContent (conteúdo do dia com swipe)
```tsx
function DayContent({ 
  routines, 
  onSwipeLeft, 
  onSwipeRight 
}: { 
  routines: Routine[]; 
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const [touchStart, setTouchStart] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { // threshold
      if (diff > 0) onSwipeLeft();
      else onSwipeRight();
    }
  };
  
  return (
    <div 
      className="flex-1 overflow-y-auto px-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {routines.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>Nenhuma rotina para este dia</p>
          <button className="mt-4 text-purple-400">+ Adicionar</button>
        </div>
      ) : (
        <div className="space-y-3">
          {routines.map(routine => (
            <RoutineCard key={routine.id} routine={routine} onDelete={...} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Estrutura Principal
```tsx
export default function RoutinesPage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [routines, setRoutines] = useState<Routine[]>([]);
  
  // Filtra rotinas do dia
  const dayRoutines = routines.filter(r => {
    const days = r.daysOfWeek ? JSON.parse(r.daysOfWeek) : [0,1,2,3,4,5,6];
    return days.includes(selectedDay);
  });
  
  const goToPrevDay = () => setSelectedDay((selectedDay - 1 + 7) % 7);
  const goToNextDay = () => setSelectedDay((selectedDay + 1) % 7);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header fixo */}
      <header className="...">...</header>
      
      {/* Day Selector */}
      <DaySelector selected={selectedDay} onChange={setSelectedDay} />
      
      {/* Conteúdo do dia (scrollable, com swipe) */}
      <DayContent 
        routines={dayRoutines}
        onSwipeLeft={goToNextDay}
        onSwipeRight={goToPrevDay}
      />
      
      {/* Templates (colapsável ou em modal) */}
      <TemplatesSection />
    </div>
  );
}
```

## Animação de Transição (opcional)
Usar `framer-motion` para animar a troca de dias:
```tsx
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={selectedDay}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.2 }}
  >
    <DayContent routines={dayRoutines} />
  </motion.div>
</AnimatePresence>
```

## Modificações no Modelo

### Ao criar rotina, perguntar os dias:
- Checkbox: [x] Seg [x] Ter [x] Qua [x] Qui [x] Sex [ ] Sab [ ] Dom
- Ou atalhos: "Todos", "Dias úteis", "Fim de semana"

### Salvar no campo `daysOfWeek`:
```ts
// JSON string: "[1,2,3,4,5]" para seg-sex
await db.routine.create({
  data: {
    ...
    daysOfWeek: JSON.stringify([1,2,3,4,5]),
  }
});
```

## Output Esperado
1. Componente `DaySelector` com nome do dia, setas e dots
2. Lógica de swipe para navegar entre dias
3. Filtragem de rotinas por `daysOfWeek`
4. Indicador visual do dia atual (destaque no dot)
5. Layout vertical removido, tudo dentro do carousel por dia

Use TypeScript, Tailwind CSS, React hooks.
