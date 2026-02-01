# TASK: Templates por Categoria

## Objetivo
Reorganizar os templates de rotina em CATEGORIAS expandíveis. Ao clicar numa categoria, ela expande mostrando os templates disponíveis.

## Estrutura de Dados

### Antes (array flat):
```ts
const ROUTINE_TEMPLATES = [
  { name: "Manhã Produtiva", type: "morning", ... },
  { name: "Noite Tranquila", type: "evening", ... },
  ...
];
```

### Depois (agrupado por categoria):
```ts
interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  templates: RoutineTemplate[];
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "morning",
    name: "Manhã",
    icon: "🌅",
    color: "#f97316",
    templates: [
      { name: "Manhã Produtiva", description: "Do despertar ao trabalho com energia", ... },
      { name: "Manhã Energética", description: "Exercícios e energia pra começar o dia", ... },
      { name: "Manhã Zen", description: "Calma, meditação e mindfulness", ... },
    ]
  },
  {
    id: "work",
    name: "Trabalho",
    icon: "💼",
    color: "#3b82f6",
    templates: [
      { name: "Deep Work", description: "Blocos de foco profundo", ... },
      { name: "Reuniões & Admin", description: "Dia de calls e tarefas administrativas", ... },
    ]
  },
  {
    id: "workout",
    name: "Treino",
    icon: "💪",
    color: "#22c55e",
    templates: [
      { name: "Treino Completo", description: "Aquecimento ao recovery", ... },
      { name: "HIIT Rápido", description: "20 minutos de alta intensidade", ... },
      { name: "Yoga & Alongamento", description: "Flexibilidade e relaxamento", ... },
    ]
  },
  {
    id: "evening",
    name: "Noite",
    icon: "🌙",
    color: "#8b5cf6",
    templates: [
      { name: "Noite Tranquila", description: "Desacelerar para dormir bem", ... },
      { name: "Noite Social", description: "Jantar fora ou com amigos", ... },
    ]
  },
  {
    id: "special",
    name: "Especiais",
    icon: "🌸",
    color: "#ec4899",
    templates: [
      { name: "Domingo Regenerativo", description: "Dia de descanso e planejamento", ... },
      { name: "Dia de Foco Total", description: "Um dia inteiro de produtividade", ... },
    ]
  },
];
```

## Componente UI

### TemplateCategory Component
```tsx
function TemplateCategory({ category, onSelectTemplate }: { 
  category: TemplateCategory; 
  onSelectTemplate: (template: RoutineTemplate) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header - clicável */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-2xl">{category.icon}</span>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-white">{category.name}</h3>
          <span className="text-xs text-zinc-500">{category.templates.length} templates</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Templates - visível quando expandido */}
      {expanded && (
        <div className="border-t border-zinc-800 p-2 space-y-2">
          {category.templates.map(template => (
            <button
              key={template.name}
              onClick={() => onSelectTemplate(template)}
              className="w-full p-3 text-left rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{template.icon}</span>
                <span className="font-medium text-white">{template.name}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{template.description}</p>
              <div className="flex gap-2 mt-2 text-[10px] text-zinc-600">
                <span>{template.steps.length} passos</span>
                <span>•</span>
                <span>{template.steps.reduce((a, s) => a + s.duration, 0)} min</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Render na página
```tsx
{/* Templates por Categoria */}
<div className="space-y-3">
  <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
    📦 Templates Prontos
  </h2>
  <div className="space-y-2">
    {TEMPLATE_CATEGORIES.map(category => (
      <TemplateCategory
        key={category.id}
        category={category}
        onSelectTemplate={handleCreateFromTemplate}
      />
    ))}
  </div>
</div>
```

## Templates Completos (com steps)

Crie pelo menos 2-3 templates por categoria, cada um com 5-10 steps detalhados incluindo:
- name: string
- description: string
- icon: string (emoji)
- type: string (morning/work/workout/evening/custom)
- color: string (hex)
- startTime: string (HH:mm)
- steps: array de { name, icon, duration, type, isOptional }

## Output Esperado
1. Novo array `TEMPLATE_CATEGORIES` com todas as categorias e templates
2. Componente `TemplateCategory` 
3. Atualizar o render da seção de templates pra usar categorias
4. Remover o array antigo `ROUTINE_TEMPLATES`

Mantenha TypeScript, Tailwind CSS, e a função `handleCreateFromTemplate` existente.
