# BiriVibe - Módulo de Rotinas: Visão do Produto

## Resumo
Sistema de rotinas diárias com onboarding conversacional, navegação semanal por carousel, e templates organizados por categoria.

---

## Fluxo Principal

### 1. Onboarding Conversacional
- Usuário descreve sua rotina ideal em **texto livre**
- Exemplo: *"Acordo 7h, trabalho remoto, treino 3x/semana, gosto de meditar..."*
- **API de LLM** processa e gera rotina personalizada estruturada
- Usuário revisa e ajusta

> ⚠️ **NOTA:** O assistente no app terá nome/marca própria (NÃO é "Douglas" - Douglas é bot pessoal do Gabriel, separado do produto BiriVibe)

### 2. Navegação Semanal (Carousel)
- Interface de **swipe horizontal** por dia da semana
- Cada dia mostra suas rotinas específicas
- Indicador de dots mostrando qual dia está selecionado
- Evita scroll vertical infinito

```
     ← [●○○○○○○] →
    ┌─────────────────┐
    │   SEGUNDA-FEIRA │
    │   🌅 Manhã      │
    │   💼 Trabalho   │
    │   🌙 Noite      │
    └─────────────────┘
        ← swipe →
```

### 3. Templates por Categoria
- Templates organizados em **categorias expansíveis**
- Categorias: Manhã, Trabalho, Treino, Noite, Especiais
- Cada categoria tem múltiplos templates
- Clica na categoria → expande → mostra templates

### 4. Finalização → Sugestão de Habits
- Quando usuário diz "rotina pronta"
- Sistema sugere **track habits** relacionados
- Integração com módulo de hábitos do BiriVibe

---

## Decisões de Design

### ✅ Confirmadas
- **Carousel horizontal** para navegação semanal (não vertical)
- **Templates por categoria** (não lista flat)
- **Drag & drop** para reordenar rotinas
- **Cards expansíveis** para ver steps (não modo "play")
- Rotinas **"morning" sempre no topo** quando reordenadas

### 🔄 Em Definição
- Nome/marca do assistente no app
- Detalhes do onboarding conversacional
- Integração exata com módulo de habits

---

## Tasks Técnicas

| Task | Arquivo | Status |
|------|---------|--------|
| Drag & Drop | `TASK-DRAG-DROP.md` | ✅ Implementado |
| Templates por Categoria | `TASK-TEMPLATE-CATEGORIES.md` | 📝 Pronto pra dev |
| Carousel Semanal | `TASK-WEEKLY-CAROUSEL.md` | 📝 Pronto pra dev |
| Onboarding LLM | - | 🔄 Aguardando definição |

---

## Stack Técnica
- **Framework:** Next.js 14 (App Router)
- **UI:** React + Tailwind CSS
- **Drag & Drop:** @dnd-kit/core, @dnd-kit/sortable
- **Animações:** framer-motion (opcional)
- **Banco:** Prisma + SQLite
- **LLM (futuro):** API configurável (OpenAI, modelo local, etc)

---

*Última atualização: 2026-02-01*
*Autor: Maycon (agente)*
