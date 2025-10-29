"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { FoodCard } from "@/components/food-card";
import { NutrientDetails } from "@/components/nutrient-details";
import { DailyIntake } from "@/components/daily-intake";
import { Input } from "@/components/ui/input";
import { Search, Utensils } from "lucide-react";
import { foodItems } from "@/lib/foods";
import type { FoodItem, NutrientAnalysis, DailyIntakeItem } from "@/lib/types";
import { analyzeFoodNutrients } from "@/ai/flows/analyze-food-nutrients";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function NutriScanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [analysisResult, setAnalysisResult] = useState<NutrientAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dailyIntake, setDailyIntake] = useState<DailyIntakeItem[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (selectedFood) {
      setSelectedQuantity(selectedFood.quantities[0] || "");
      setAnalysisResult(null);
    }
  }, [selectedFood]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery) return foodItems;
    return foodItems.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    if(isMobile) {
      setSheetOpen(true);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFood || !selectedQuantity) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeFoodNutrients({
        foodItem: selectedFood.name,
        quantity: selectedQuantity,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not retrieve nutritional information. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToDailyIntake = () => {
    if (!analysisResult || !selectedFood) return;
    const newItem: DailyIntakeItem = {
      ...analysisResult,
      id: `${Date.now()}-${selectedFood.id}`,
      foodName: selectedFood.name,
    };
    setDailyIntake((prev) => [...prev, newItem]);
    toast({
      title: "Item Added",
      description: `${selectedFood.name} has been added to your daily intake.`,
    });
  };

  const handleRemoveDailyIntakeItem = (id: string) => {
    setDailyIntake((prev) => prev.filter((item) => item.id !== id));
  };

  const DetailsPanel = () => (
    <div className="space-y-8">
      {selectedFood ? (
        <NutrientDetails
          selectedFood={selectedFood}
          selectedQuantity={selectedQuantity}
          onQuantityChange={(q) => {
            setSelectedQuantity(q);
            setAnalysisResult(null);
          }}
          onAnalyze={handleAnalyze}
          onAddToDailyIntake={handleAddToDailyIntake}
          analysis={analysisResult}
          isAnalyzing={isAnalyzing}
        />
      ) : (
        <Card className="flex h-96 flex-col items-center justify-center text-center p-8">
          <CardContent>
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Select a food item</h3>
            <p className="text-muted-foreground">
              Choose a food from the list to see its nutritional details.
            </p>
          </CardContent>
        </Card>
      )}
      <DailyIntake items={dailyIntake} onRemoveItem={handleRemoveDailyIntakeItem} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for food items..."
                className="w-full pl-10 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onSelect={handleFoodSelect}
                  isSelected={selectedFood?.id === food.id}
                />
              ))}
            </div>
            {filteredFoods.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg font-medium text-muted-foreground">No food items found.</p>
                <p className="text-sm text-muted-foreground">Try a different search term.</p>
              </div>
            )}
          </div>
          {isMobile ? (
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="right" className="w-[90vw] sm:max-w-md overflow-y-auto p-4">
                <DetailsPanel />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <DetailsPanel />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
