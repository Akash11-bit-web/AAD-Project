"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { FoodItem, NutrientAnalysis } from "@/lib/types";
import { Info, PlusCircle } from "lucide-react";

interface NutrientDetailsProps {
  selectedFood: FoodItem;
  selectedQuantity: string;
  onQuantityChange: (quantity: string) => void;
  onAnalyze: () => void;
  onAddToDailyIntake: () => void;
  analysis: NutrientAnalysis | null;
  isAnalyzing: boolean;
}

const chartConfig = {
  value: {
    label: "Grams",
  },
  carbohydrates: {
    label: "Carbs",
    color: "hsl(var(--chart-1))",
  },
  proteins: {
    label: "Protein",
    color: "hsl(var(--chart-2))",
  },
  fats: {
    label: "Fat",
    color: "hsl(var(--destructive))",
  },
};

export function NutrientDetails({
  selectedFood,
  selectedQuantity,
  onQuantityChange,
  onAnalyze,
  onAddToDailyIntake,
  analysis,
  isAnalyzing,
}: NutrientDetailsProps) {
  const chartData = analysis
    ? [
        {
          name: "Carbs",
          value: analysis.macronutrientBreakdown.carbohydrates,
          fill: "var(--color-carbohydrates)",
        },
        {
          name: "Protein",
          value: analysis.macronutrientBreakdown.proteins,
          fill: "var(--color-proteins)",
        },
        {
          name: "Fat",
          value: analysis.macronutrientBreakdown.fats,
          fill: "var(--color-fats)",
        },
      ]
    : [];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{selectedFood.name}</CardTitle>
        <CardDescription>Select quantity to analyze nutrients.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Select
            value={selectedQuantity}
            onValueChange={onQuantityChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent>
              {selectedFood.quantities.map((q) => (
                <SelectItem key={q} value={q}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onAnalyze} disabled={isAnalyzing || !selectedQuantity}>
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {analysis && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div>
              <p className="text-sm text-muted-foreground">Total Calories</p>
              <p className="text-4xl font-bold text-primary">
                {analysis.calorieCount.toLocaleString()} kcal
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For {analysis.servingSize}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Macronutrient Breakdown</p>
              <ChartContainer config={chartConfig} className="h-40 w-full">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            {analysis.micronutrientDetails && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Micronutrients</p>
                <p className="text-sm text-muted-foreground">{analysis.micronutrientDetails}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Health Insights</p>
              <div className="flex items-start gap-2 rounded-lg border border-accent/50 bg-accent/10 p-3">
                <Info className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                <p className="text-sm text-accent-foreground">{analysis.healthInsights}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {analysis && !isAnalyzing && (
        <CardFooter>
          <Button onClick={onAddToDailyIntake} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Daily Intake
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
