# TASK: Drag & Drop para Rotinas e Steps

## Objetivo
Implementar drag-and-drop para:
1. Reordenar **steps** dentro de uma rotina (quando expandida)
2. Reordenar as **rotinas** na lista principal
3. Garantir que "Manhã" (type: morning) fique sempre no topo
4. Salvar ordem no banco de dados

## Biblioteca
Use `@dnd-kit/core` + `@dnd-kit/sortable`

## Instalação
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Parte 1: Drag & Drop de Steps (dentro da rotina)

### Arquivo: `app/routines/[id]/edit/page.tsx` (já existe)
- Wrap a lista de steps com `<SortableContext>`
- Cada step vira um `<SortableItem>`
- Ao soltar, atualizar ordem e salvar via API

### Exemplo de código:
```tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableStep({ step }: { step: RoutineStep }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* conteúdo do step */}
    </div>
  );
}

// No componente principal:
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
    {steps.map(step => (
      <SortableStep key={step.id} step={step} />
    ))}
  </SortableContext>
</DndContext>
```

### API para salvar ordem de steps
`PUT /api/routines/[id]/steps/reorder`
```ts
// body: { stepIds: string[] } // array com IDs na ordem desejada
// Atualiza o campo `order` de cada step no DB
```

## Parte 2: Drag & Drop de Rotinas (lista principal)

### Arquivo: `app/routines/page.tsx`
Similar ao de steps, mas aplicado às rotinas.

### Restrição: Manhã sempre no topo
No `handleDragEnd`:
```ts
function handleDragEnd(event) {
  const { active, over } = event;
  if (!over || active.id === over.id) return;
  
  const oldIndex = routines.findIndex(r => r.id === active.id);
  const newIndex = routines.findIndex(r => r.id === over.id);
  
  let reordered = arrayMove(routines, oldIndex, newIndex);
  
  // REGRA: Manhã sempre no topo
  reordered.sort((a, b) => {
    if (a.type === 'morning') return -1;
    if (b.type === 'morning') return 1;
    return 0; // mantém ordem customizada para o resto
  });
  
  setRoutines(reordered);
  saveOrder(reordered.map(r => r.id));
}
```

### API para salvar ordem de rotinas
`PUT /api/routines/reorder`
```ts
// body: { routineIds: string[] }
// Atualiza o campo `order` de cada rotina no DB
```

## Mudanças no Schema (se necessário)
O campo `order` já existe em `Routine` e `RoutineStep`. Use-o para persistir a ordem customizada.

## Visual
Quando arrastando:
- Cursor vira `grab` / `grabbing`
- Item sendo arrastado tem opacity reduzida ou shadow
- Indicador visual de onde vai cair (linha ou highlight)

## Retorne
1. Código atualizado de `app/routines/page.tsx` com drag & drop de rotinas
2. Código de `app/routines/[id]/edit/page.tsx` com drag & drop de steps
3. APIs de reorder (`/api/routines/reorder/route.ts` e `/api/routines/[id]/steps/reorder/route.ts`)

Use TypeScript, Tailwind CSS, e componentes funcionais com hooks.
