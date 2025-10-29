"use client";

import Image from "next/image";
import type { FoodItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface FoodCardProps {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
  isSelected: boolean;
}

export function FoodCard({ food, onSelect, isSelected }: FoodCardProps) {
  const Icon = food.icon;
  const placeholder = PlaceHolderImages.find((p) => p.id === food.imageId);

  return (
    <Card
      onClick={() => onSelect(food)}
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
        isSelected
          ? "ring-2 ring-primary shadow-lg"
          : "ring-0"
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/2] w-full overflow-hidden rounded-t-lg">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={food.name}
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>
        <div className="flex items-center gap-4 p-4">
          <Icon className="h-8 w-8 shrink-0 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">{food.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
