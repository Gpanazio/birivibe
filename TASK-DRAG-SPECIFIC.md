# TASK: Add Drag & Drop to app/routines/page.tsx

## Context
File: `app/routines/page.tsx`
- Already has RoutineCard component (lines 175-290)
- Already has routines list rendering (lines 550-565)
- Need to add drag-and-drop to reorder routines

## Requirements
1. Install: `@dnd-kit/core` `@dnd-kit/sortable` `@dnd-kit/utilities`
2. Add drag & drop to reorder routines in the list
3. **CRITICAL:** Routines with `type === 'morning'` must ALWAYS stay at top
4. Save new order to API: `PUT /api/routines/reorder` with `{ routineIds: string[] }`

## Current Code Structure

### Imports (top of file):
```tsx
"use client";
import { useState, useEffect } from "react";
import { Plus, Sun, Moon, ... } from "lucide-react";
import Link from "next/link";
```

### State:
```tsx
const [routines, setRoutines] = useState<Routine[]>([]);
```

### Current Rendering (lines ~555-565):
```tsx
{Object.entries(groupedRoutines).map(([type, typeRoutines]) => (
  <div key={type} className="space-y-3">
    <h2>...</h2>
    <div className="space-y-3">
      {typeRoutines.map(routine => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          onDelete={() => handleDelete(routine.id)}
        />
      ))}
    </div>
  </div>
))}
```

## What to Add

### 1. New Imports
```tsx
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
```

### 2. Create SortableRoutineCard Component
Wrap RoutineCard with sortable functionality. Add drag handle (GripVertical icon).

```tsx
function SortableRoutineCard({ routine, onDelete }: { routine: Routine; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: routine.id 
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10" {...attributes} {...listeners}>
        <GripVertical className="w-5 h-5 text-zinc-600 cursor-grab active:cursor-grabbing" />
      </div>
      <RoutineCard routine={routine} onDelete={onDelete} />
    </div>
  );
}
```

### 3. Add handleDragEnd Function
```tsx
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = routines.findIndex(r => r.id === active.id);
  const newIndex = routines.findIndex(r => r.id === over.id);
  
  if (oldIndex === -1 || newIndex === -1) return;

  const reordered = [...routines];
  const [moved] = reordered.splice(oldIndex, 1);
  reordered.splice(newIndex, 0, moved);

  // CRITICAL: Keep morning routines at top
  const sorted = reordered.sort((a, b) => {
    if (a.type === 'morning' && b.type !== 'morning') return -1;
    if (a.type !== 'morning' && b.type === 'morning') return 1;
    return 0;
  });

  setRoutines(sorted);

  // Save to API
  try {
    await fetch('/api/routines/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routineIds: sorted.map(r => r.id) }),
    });
  } catch (error) {
    console.error('Failed to save order:', error);
  }
};
```

### 4. Wrap Rendering with DndContext
Replace the current grouped rendering with flat sortable list:

```tsx
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={routines.map(r => r.id)} strategy={verticalListSortingStrategy}>
    <div className="space-y-3">
      {routines.map(routine => (
        <SortableRoutineCard
          key={routine.id}
          routine={routine}
          onDelete={() => handleDelete(routine.id)}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>
```

## Output Required
Return the COMPLETE updated `app/routines/page.tsx` file with:
- ✅ All imports added
- ✅ SortableRoutineCard component created
- ✅ handleDragEnd function added
- ✅ Rendering wrapped with DndContext
- ✅ All existing functionality preserved (expand/collapse, delete, templates, etc.)

Use TypeScript. Keep all existing code. Only add drag & drop feature.
