export type MealCategory = 'café da manhã' | 'almoço' | 'lanche' | 'janta';

export const MEAL_CATEGORIES: MealCategory[] = ['café da manhã', 'almoço', 'lanche', 'janta'];

export const MEAL_CATEGORY_LABELS: Record<MealCategory, string> = {
  'café da manhã': '☕ Café',
  'almoço': '🍽️ Almoço',
  'lanche': '🍪 Lanche',
  'janta': '🌙 Janta',
};

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
}

export interface MicroNutrients {
  vitaminA: number;
  vitaminC: number;
  calcium: number;
  iron: number;
}

export interface FoodItem extends MacroNutrients, MicroNutrients {
  id: string;
  name: string;
  timestamp: string;
  date?: string;
  mealCategory?: MealCategory;
}

export interface DailyLog {
  date: string;
  items: FoodItem[];
}

export interface UserGoals {
  calories: number;
  protein: number;
  height?: number;
  objectives?: string[];
  intolerances?: string[];
  conditions?: string[];
}

export interface UserSettings {
  goals: UserGoals;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  WEIGHT = 'WEIGHT'
}

export interface GeminiParsedFood extends MacroNutrients, MicroNutrients {
  name: string;
  date?: string;
  mealCategory?: MealCategory;
}
