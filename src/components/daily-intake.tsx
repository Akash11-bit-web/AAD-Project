"use client";

import type { DailyIntakeItem } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Utensils } from "lucide-react";

interface DailyIntakeProps {
  items: DailyIntakeItem[];
  onRemoveItem: (id: string) => void;
}

export function DailyIntake({ items, onRemoveItem }: DailyIntakeProps) {
  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calorieCount;
      acc.carbs += item.macronutrientBreakdown.carbohydrates;
      acc.protein += item.macronutrientBreakdown.proteins;
      acc.fat += item.macronutrientBreakdown.fats;
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Daily Intake</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
            <Utensils className="h-10 w-10 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Your daily food log is empty.</p>
            <p className="text-sm text-muted-foreground/80">Add items from the analysis panel.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm text-secondary-foreground/80">Calories</p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {Math.round(totals.calories)}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm text-secondary-foreground/80">Protein</p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {Math.round(totals.protein)}g
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm text-secondary-foreground/80">Carbs</p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {Math.round(totals.carbs)}g
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-sm text-secondary-foreground/80">Fat</p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {Math.round(totals.fat)}g
                </p>
              </div>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="items">
                <AccordionTrigger>
                  {items.length} item{items.length > 1 ? 's' : ''} logged
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pt-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between rounded-md bg-muted/50 p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {item.foodName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.servingSize} - {item.calorieCount} kcal
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
