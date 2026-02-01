# BiriVibe - Gamificação (Inspirado no Duolingo)

## Visão
Tornar o uso do app **viciante de um jeito bom**. O usuário deve QUERER abrir o app todo dia, não por obrigação, mas porque é divertido e recompensador.

---

## Sistemas de Gamificação

### 🔥 Streaks (Sequência)
- Contador de dias consecutivos usando o app
- **Regra:** Completar pelo menos 1 rotina/hábito por dia
- **Visual:** Número com chamas, aumenta conforme streak cresce
- **Proteção:** "Streak Freeze" - pode usar 1x pra não perder

```
🔥 15 dias seguidos!
[████████████████░░░░] 15/30 → próxima conquista
```

### ⭐ XP (Pontos de Experiência)
**Ganha XP por:**
| Ação | XP |
|------|-----|
| Completar step de rotina | +5 |
| Completar rotina inteira | +20 |
| Marcar hábito do dia | +10 |
| Completar meta diária | +30 |
| Manter streak | +5/dia |
| Primeira vez no dia | +10 |

### 📈 Sistema de Níveis
Baseado em XP total acumulado:

| Nível | XP Necessário | Título |
|-------|---------------|--------|
| 1-5 | 0-500 | Iniciante |
| 6-10 | 500-2000 | Aprendiz |
| 11-20 | 2000-5000 | Praticante |
| 21-30 | 5000-10000 | Dedicado |
| 31-40 | 10000-20000 | Expert |
| 41-50 | 20000-50000 | Mestre |
| 50+ | 50000+ | Lenda |

### 🏆 Ligas Semanais
Rankings competitivos (opc ional - pode desativar):

| Liga | Descrição |
|------|-----------|
| 🥉 Bronze | Todos começam aqui |
| 🥈 Prata | Top 10 sobem |
| 🥇 Ouro | Top 10 sobem |
| 💎 Diamante | Top 10 sobem |
| 👑 Obsidian | Elite |

- Reset toda segunda-feira
- Top 3 ganham bônus de XP
- Últimos 5 descem de liga

### 🎖️ Conquistas (Achievements)
Badges desbloqueáveis:

**Streaks:**
- 🔥 Fogo Inicial - 3 dias seguidos
- 🔥 Semana de Fogo - 7 dias seguidos
- 🔥 Mês Insano - 30 dias seguidos
- 🔥 Centurião - 100 dias seguidos
- 🔥 Lendário - 365 dias seguidos

**Completude:**
- ✅ Primeiro Passo - Completar primeira rotina
- ✅ Madrugador - Completar rotina antes das 7h
- ✅ Coruja - Completar rotina depois das 22h
- ✅ Fim de Semana - Manter hábitos no sábado E domingo
- ✅ Perfeccionista - 100% de uma semana

**Social:**
- 👥 Sociável - Adicionar 5 amigos
- 🏅 Campeão - Vencer uma liga
- 🎁 Generoso - Compartilhar uma rotina

**Especiais:**
- 🌅 Pessoa Matinal - 30 rotinas de manhã
- 💪 Atleta - 50 treinos registrados
- 🧘 Zen Master - 100 sessões de meditação

### 💎 Moeda Virtual (Gems/Vibes)
**Ganha gems por:**
- Completar conquistas
- Subir de nível
- Streaks longos
- Top 3 da liga

**Usa gems pra:**
- Streak Freeze (proteger streak)
- Temas/skins do app
- Avatares especiais
- Desbloquear templates premium
- Desafios especiais

### 🎯 Meta Diária
Usuário escolhe intensidade:
- Casual: 30 XP/dia
- Regular: 50 XP/dia  
- Sério: 100 XP/dia
- Insano: 200 XP/dia

### 🎉 Feedback Visual
- **Confetes** ao completar rotina
- **Animações** de level up
- **Sons** satisfatórios
- **Mensagens motivacionais**
- **Celebração especial** em milestones

---

## Mascote (Ideia)
Criar um mascote pro BiriVibe tipo o Duo do Duolingo:
- Personalidade amigável mas "cobra"
- Aparece em notificações
- Reage às conquistas
- Fica triste se você some

---

## Notificações Persuasivas (estilo Duolingo)

**Motivacionais:**
- "Bom dia! Sua rotina da manhã está esperando ☀️"
- "Falta só 1 hábito pra bater sua meta! 💪"

**FOMO (Fear of Missing Out):**
- "Seu streak de 15 dias está em risco! 🔥"
- "Você vai deixar o João te passar na liga? 👀"

**Celebração:**
- "BOOM! 30 dias de streak! Você é incrível! 🎉"
- "Subiu pra Liga Ouro! 🏆"

---

## 🤗 Psicologia Positiva (Anti-Culpa)

**Princípio:** Nunca fazer o usuário se sentir mal. Encorajar sempre.

### Quando Falha
- ❌ NÃO: "Você perdeu seu streak de 30 dias 😢"
- ✅ SIM: "Dia difícil? Acontece. O importante é voltar! 💪"

### Quando Volta
- ❌ NÃO: "Faz 5 dias que você não aparece..."
- ✅ SIM: "Que bom te ver de volta! Bora recomeçar? 🎉"

### Mecânicas de Recuperação
- **Streak Recuperável** - Voltou em 48h? Streak não zera!
- **Foco no Positivo** - "85% do mês, mesmo com 2 dias off!"
- **Conquista de Resiliência** - Badge especial por VOLTAR depois de falhar
- **Check-in Gentil** - "Tudo bem? Quer ajustar suas metas?"

### Tom das Mensagens
- Amigo, não chefe
- Compreensivo, não julgador
- Motivador, não culpabilizador
- Celebra tentativas, não só sucessos

### Mascote com Empatia
O mascote deve ter personalidade:
- Fica feliz quando você volta (não bravo)
- Entende dias ruins
- Comemora pequenas vitórias
- Nunca faz cara de decepção

---

## Configurações de Gamificação
Usuário pode ajustar:
- [ ] Ativar/desativar ligas (social)
- [ ] Nível de notificações
- [ ] Esconder XP/níveis (modo zen)
- [ ] Sons ligados/desligados

---

*Referência: Duolingo, Habitica, Forest*
*Atualizado: 2026-02-01*
