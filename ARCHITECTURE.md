# BiriVibe OS - Arquitetura

*Versão: 1.0 | Atualizado: 2026-01-31*

---

## Visão Geral

BiriVibe OS é um **Life Operating System** - um hub centralizado que substitui múltiplos apps de tracking (hábitos, dieta, treino, sono, etc.) por uma interface única com entrada via texto natural (Daily Dump) processado por IA (Douglas).

**Diferencial:** Correlações automáticas entre módulos.
- "Quando durmo menos de 6h, meu humor cai 40%"
- "Nos dias que treino, como 15% mais proteína"
- "Minha produtividade é maior quando medito de manhã"

---

## Arquitetura de Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    BIRIVIBE OS                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │           CAMADA BASE: PERFIL DE SAÚDE            │  │
│  │  (Contexto permanente que informa todos módulos)  │  │
│  │                                                   │  │
│  │  • Condições (diabetes, TDAH, hipertensão...)    │  │
│  │  • Medicações (nome, dose, frequência)           │  │
│  │  • Alergias / Restrições alimentares             │  │
│  │  • Médicos / Profissionais de saúde              │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              MÓDULOS FUNCIONAIS                  │   │
│  │                                                  │   │
│  │  1. Rotina & Hábitos                            │   │
│  │  2. Dieta & Nutrição (Biridiet2000)             │   │
│  │     └── Métricas Corporais                      │   │
│  │  3. Exercício & Fitness                         │   │
│  │  4. Sono                                        │   │
│  │  5. Saúde Mental & Humor                        │   │
│  │  6. Produtividade & Tempo                       │   │
│  │                                                  │   │
│  │  [V2] 7. Finanças                               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Entrada de Dados

### Daily Dump (Input Principal)
Texto livre processado por Douglas (Gemini) que extrai e categoriza automaticamente.

**Modos:**
- `/biri` - Dump geral (parseia tudo)
- `/biri food` - Só nutrição
- `/biri workout` - Só treino
- `/biri habits` - Só hábitos
- `/biri sleep` - Só sono
- `/biri mind` - Só humor/journal
- `/biri health` - Só medicação/saúde

**Exemplo de dump geral:**
```
Acordei 7h, dormi bem. Tomei os remédios. Almocei arroz, feijão, frango grelhado 150g. 
Treinei peito - supino 4x10 60kg, crucifixo 3x12. Humor 7/10, produtivo.
```

Douglas parseia e salva em cada módulo automaticamente.

---

## Módulos - Escopo Detalhado

### 1. Rotina & Hábitos

**Essencial:**
- Criação de hábitos com frequência (diário, semanal, X vezes)
- Check diário (fez/não fez)
- Streaks (dias consecutivos)
- Visualização calendário ("quadradinhos verdes")

**Nice-to-have:**
- Hábitos encadeados (se fiz X, lembrar Y)
- Lembretes/notificações
- Conquistas/achievements

**Referências:** Loop Habit Tracker, Habitica

---

### 2. Dieta & Nutrição (Biridiet2000)

**Essencial:**
- Log de refeições
- Calorias e macros (proteína, carbs, gordura)
- Metas nutricionais configuráveis
- Banco de alimentos favoritos
- **Métricas Corporais:** peso, medidas, % gordura, fotos progresso

**Nice-to-have:**
- Reconhecimento de foto com IA
- Receitas favoritas
- Jejum intermitente (timer)
- Hidratação

**Fora de escopo V1:**
- Scanner código de barras

**Referências:** wger (nutrição), Cronometer

---

### 3. Exercício & Fitness

**Essencial:**
- Log de treinos (musculação, cardio)
- Banco de exercícios
- Séries, reps, peso
- Progressão de carga/volume
- Histórico

**Nice-to-have:**
- Templates de treino
- Planos de treino

**Fora de escopo V1:**
- GPS/mapas (atividades outdoor)
- Integração wearables (Apple Watch, Garmin)
- Importação GPX

**Referências:** wger, Workout Tracker

---

### 4. Sono

**Essencial:**
- Hora de dormir / acordar
- Duração calculada
- Qualidade (escala 1-10, manual)
- Notas

**Nice-to-have:**
- Correlação com humor/energia do dia seguinte
- Média semanal/mensal

**Fora de escopo V1:**
- Integração com wearables
- Detecção de ciclos

**Referências:** Sleep Cycle (conceito)

---

### 5. Saúde Mental & Humor

**Essencial:**
- Check-in diário de humor (escala 1-10)
- Nível de energia (escala 1-10)
- Medicação tomada (check)
- Journaling rápido

**Nice-to-have:**
- Gratidão (3 coisas boas)
- Nível de estresse
- Tracking de sintomas específicos
- Histórico de consultas (psiq/terapia)

**Referências:** Daylio, Pixels

---

### 6. Produtividade & Tempo

**Essencial:**
- To-do list
- Time tracking básico por projeto/categoria
- Tarefas completadas

**Nice-to-have:**
- Pomodoro timer
- Metas semanais
- Review semanal automático
- Blocos de foco

**Fora de escopo V1:**
- Integrações (Toggl, RescueTime, Todoist)

**Referências:** Flow Dashboard

---

### 7. Finanças [V2]

**Planejado para V2:**
- Gastos rápidos
- Categorias
- Orçamento vs realizado
- Metas de economia

---

## Camada Base: Perfil de Saúde

Dados permanentes que contextualizam todos os módulos.

**Condições Médicas:**
```
- Tipo: (ex: TDAH, Diabetes Tipo 2, Hipertensão)
- Desde: data diagnóstico
- Observações
```

**Medicações:**
```
- Nome
- Dosagem
- Frequência (1x dia, 2x dia, etc)
- Horários
- Para qual condição
- Efeitos colaterais conhecidos
```

**Alergias/Restrições:**
```
- Tipo: (alimentar, medicamento, outro)
- Severidade
```

**Profissionais de Saúde:**
```
- Nome
- Especialidade
- Contato
- Próxima consulta
```

**Como a camada base afeta os módulos:**
- **Dieta:** Restrições alimentares aparecem como alertas
- **Rotina:** Medicações viram hábitos automáticos
- **Fitness:** Limitações físicas informam sugestões
- **Sono:** Efeitos de medicação considerados
- **Mente:** Acompanhamento psiquiátrico integrado

---

## Visualização (Dashboard)

### Estilo: The Sims + Cyberpunk

**Barras de Necessidade:**
- Energia (baseado em sono)
- Físico (baseado em treino)
- Nutrição (baseado em dieta)
- Mente (baseado em humor)
- Produtividade (baseado em tarefas)

**Buffs Ativos:** Tags do que foi feito hoje
- +Treino, +Remédios, +8h Sono, +Meta Proteína

**Calendários:** Consistência por módulo (heatmaps)

**Gráficos:** Evolução temporal de métricas chave

**Insights:** Correlações detectadas automaticamente

---

## Stack Técnico

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** SQLite (dev) / Cloudflare D1 (prod)
- **ORM:** Prisma
- **IA:** Google Gemini 2.5 Flash Lite
- **Deploy:** Cloudflare Pages

---

## Projetos de Referência

| Área | Projeto | O que pegar |
|------|---------|-------------|
| Treino + Nutrição | [wger](https://github.com/wger-project/wger) | Banco exercícios/alimentos, lógica progressão |
| Hábitos | [Loop](https://github.com/iSoron/uhabits) | UI calendário, streaks |
| Gamificação | [Habitica](https://github.com/HabitRPG/habitica) | Sistema XP/conquistas |
| Agregador | [QS Ledger](https://github.com/markwk/qs_ledger) | Correlações, análise |
| Dashboard | [Flow](https://github.com/onejgordon/flow-dashboard) | Estrutura geral |

---

## Roadmap

### V1 - MVP
- [ ] Camada base (perfil saúde)
- [ ] Módulo Rotina & Hábitos
- [ ] Módulo Dieta (Biridiet2000)
- [ ] Módulo Exercício
- [ ] Módulo Sono
- [ ] Módulo Saúde Mental
- [ ] Módulo Produtividade
- [ ] Daily Dump funcional (todos módulos)
- [ ] Dashboard com barras de necessidade
- [ ] Correlações básicas

### V2
- [ ] Finanças
- [ ] Gamificação avançada
- [ ] Integrações (Apple Health?)
- [ ] App mobile (PWA ou nativo)

---

*Documento vivo. Atualizar conforme decisões forem tomadas.*
