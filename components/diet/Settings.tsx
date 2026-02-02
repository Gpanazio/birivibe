import React, { useEffect, useState } from "react"
import {
  Activity,
  AlertCircle,
  Check,
  Dumbbell,
  Flame,
  Save,
  Scale,
  User,
} from "lucide-react"

import { API_BASE_URL } from "@/lib/config"
import { UserGoals } from "@/lib/diet-types"
import { getLocalDateString } from "@/lib/utils/date"
import { Button } from "@/components/diet/ui/Button"
import { Card } from "@/components/diet/ui/Card"

interface SettingsProps {
  currentGoals: UserGoals
  onSave: (goals: UserGoals) => void
}

export const Settings: React.FC<SettingsProps> = ({ currentGoals, onSave }) => {
  const [goals, setGoals] = useState<UserGoals>(currentGoals)
  const [saved, setSaved] = useState(false)
  const [latestWeight, setLatestWeight] = useState<number | null>(null)

  useEffect(() => {
    // Update local state when props change (initial load)
    // Ensure arrays are initialized
    setGoals({
      ...currentGoals,
      objectives: currentGoals.objectives || [],
      intolerances: currentGoals.intolerances || [],
      conditions: currentGoals.conditions || [],
    })
  }, [currentGoals])

  useEffect(() => {
    // Fetch latest weight for display
    const fetchWeight = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/weights`)
        if (res.ok) {
          const data = (await res.json()) as any
          // Assuming API returns sorted by date DESC (newest first) based on server.js
          if (data && data.length > 0) {
            setLatestWeight(data[0].weight)
          }
        }
      } catch (error) {
        console.error("Failed to fetch weight for settings", error)
      }
    }
    fetchWeight()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(goals)

    // Clear today's cached tip to force regeneration with new settings
    const today = getLocalDateString()
    localStorage.removeItem(`diet_tip_${today}`)

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleArrayItem = (
    field: "intolerances" | "conditions" | "objectives",
    value: string
  ) => {
    setGoals((prev) => {
      const currentArray = prev[field] || []
      const exists = currentArray.includes(value)
      const newArray = exists
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  const GoalCard = ({
    type,
    icon: Icon,
    label,
    description,
  }: {
    type: string
    icon: any
    label: string
    description: string
  }) => {
    const isSelected = (goals.objectives || []).includes(type)
    return (
      <div
        onClick={() => toggleArrayItem("objectives", type)}
        className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-300
          ${
            isSelected
              ? "border-lime-500 bg-lime-500/10 shadow-[0_0_20px_rgba(132,204,22,0.15)]"
              : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50"
          }`}
      >
        {isSelected && (
          <div className="absolute right-2 top-2 rounded-full bg-lime-500 p-0.5">
            <Check className="h-3 w-3 text-black" />
          </div>
        )}
        <Icon
          className={`h-8 w-8 ${isSelected ? "text-lime-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
        />
        <span
          className={`text-sm font-bold ${isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}
        >
          {label}
        </span>
        <span className="text-[10px] leading-tight text-zinc-500">
          {description}
        </span>
      </div>
    )
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-lime-500/10 p-3">
          <User className="h-8 w-8 text-lime-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Perfil & Metas
          </h2>
          <p className="text-sm text-zinc-400">Personalize sua experiência</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Physical Stats Card */}
        <Card className="space-y-6 p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-zinc-500">
            Dados Corporais
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-zinc-400">
                Altura (cm)
              </label>
              <input
                type="number"
                value={goals.height || ""}
                onChange={(e) =>
                  setGoals({ ...goals, height: Number(e.target.value) })
                }
                placeholder="Ex: 175"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white transition-colors focus:border-lime-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-zinc-400">
                Peso Atual (kg)
              </label>
              <div className="relative">
                <div className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-500">
                  {latestWeight ? `${latestWeight} kg` : "--"}
                </div>
                {latestWeight && (
                  <Scale className="absolute right-3 top-3 h-5 w-5 text-zinc-600" />
                )}
              </div>
              <p className="mt-1 text-[10px] text-zinc-600">
                Sincronizado com o histórico de peso.
              </p>
            </div>
          </div>
        </Card>

        {/* Goal Selection */}
        <div>
          <h3 className="mb-4 pl-1 text-sm font-bold text-white">
            Qual seu foco principal?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <GoalCard
              type="weight_loss"
              icon={Scale}
              label="Perder Peso"
              description="Foco em déficit calórico e saciedade."
            />
            <GoalCard
              type="muscle_gain"
              icon={Dumbbell}
              label="Ganhar Massa"
              description="Foco em proteína e superávit controlado."
            />
            <GoalCard
              type="fat_loss"
              icon={Flame}
              label="Secar"
              description="Manter músculos enquanto queima gordura."
            />
          </div>
        </div>

        {/* Nutritional Goals */}
        <Card className="space-y-6 p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-zinc-500">
            Metas Nutricionais Diárias
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Meta de Calorias (kcal)
              </label>
              <input
                type="number"
                value={goals.calories || ""}
                onChange={(e) =>
                  setGoals({ ...goals, calories: Number(e.target.value) })
                }
                placeholder="Ex: 2000"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white transition-colors focus:border-lime-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Deixe em branco ou 0 para desativar.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Meta de Proteínas (g)
              </label>
              <input
                type="number"
                value={goals.protein || ""}
                onChange={(e) =>
                  setGoals({ ...goals, protein: Number(e.target.value) })
                }
                placeholder="Ex: 150"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white transition-colors focus:border-lime-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Essencial para construção muscular.
              </p>
            </div>
          </div>
        </Card>

        {/* Restrictions & Conditions */}
        <Card className="space-y-6 p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-zinc-500">
            Saúde e Restrições
          </h3>

          <div>
            <label className="mb-3 block text-xs font-bold text-zinc-400">
              Intolerâncias Alimentares
            </label>
            <div className="flex flex-wrap gap-2">
              {["lactose", "gluten"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleArrayItem("intolerances", item)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors
                     ${
                       (goals.intolerances || []).includes(item)
                         ? "border-red-500 bg-red-500/10 text-red-400"
                         : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                     }`}
                >
                  {(goals.intolerances || []).includes(item) && (
                    <Check className="h-3 w-3" />
                  )}
                  {item === "lactose" ? "Lactose" : "Glúten"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 border-t border-zinc-800/50 pt-6">
            <label className="mb-3 block text-xs font-bold text-zinc-400">
              Condições Médicas
            </label>
            <button
              type="button"
              onClick={() => toggleArrayItem("conditions", "lipedema")}
              className={`flex w-full items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors md:w-auto
                 ${
                   (goals.conditions || []).includes("lipedema")
                     ? "border-purple-500 bg-purple-500/10 text-purple-400"
                     : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                 }`}
            >
              {(goals.conditions || []).includes("lipedema") && (
                <Check className="h-3 w-3" />
              )}
              <Activity className="h-4 w-4" />
              Lipedema
              <span className="ml-1 text-[10px] font-normal opacity-60">
                (Foco anti-inflamatório)
              </span>
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <div className="flex h-5 w-5 items-center justify-center font-bold text-blue-500">
                🔔
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-300">Notificações</h3>
              <p className="text-[10px] text-zinc-500">
                Lembretes e alertas do seu parceiro de treino
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Button
              type="button"
              onClick={async () => {
                const { requestNotificationPermission } =
                  await import("@/services/notificationService")
                const granted = await requestNotificationPermission()
                if (granted) alert("Notificações ativadas! 🚀")
                else alert("Você precisa permitir notificações no navegador.")
              }}
              className="border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Ativar Permissão
            </Button>

            <Button
              type="button"
              onClick={async () => {
                const { sendLocalNotification } =
                  await import("@/services/notificationService")
                sendLocalNotification(
                  "BiriDiet 2000",
                  "HORA DO RANGO MONSTRO! 💪🐓"
                )
              }}
              className="border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Testar Notificação
            </Button>
          </div>
          <p className="text-[10px] italic text-zinc-600">
            * No iPhone/iPad, funciona apenas se adicionado à Tela de Início.
          </p>
        </Card>

        <div className="sticky bottom-24 z-30">
          <div className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-zinc-950 to-transparent"></div>
          {saved && (
            <div className="animate-fade-in-up absolute -top-12 left-0 right-0 text-center">
              <span className="rounded-full bg-lime-500 px-3 py-1 text-xs font-bold text-zinc-950 shadow-lg">
                Alterações salvas!
              </span>
            </div>
          )}
          <Button type="submit" className="w-full shadow-xl shadow-lime-500/10">
            <Save className="mr-2 h-4 w-4" />
            Salvar Perfil
          </Button>
        </div>
      </form>

      <div className="mt-8 flex gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
        <AlertCircle className="h-5 w-5 shrink-0 text-zinc-600" />
        <p className="text-xs leading-relaxed text-zinc-500">
          A &quot;Biridica&quot; usará essas informações para personalizar as
          análises diárias. Sempre consulte um médico para orientações
          específicas sobre condições de saúde.
        </p>
      </div>
    </div>
  )
}
