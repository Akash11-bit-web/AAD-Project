import type { LucideIcon } from "lucide-react";
import type { AnalyzeFoodNutrientsOutput } from "@/ai/flows/analyze-food-nutrients";

export type FoodItem = {
  id: string;
  name: string;
  icon: LucideIcon;
  quantities: string[];
  imageId: string;
};

export type NutrientAnalysis = AnalyzeFoodNutrientsOutput;

export type DailyIntakeItem = {
  id: string; // unique id for list key
  foodName: string;
} & NutrientAnalysis;
