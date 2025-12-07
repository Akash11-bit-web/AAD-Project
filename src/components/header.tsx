"use client";

import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Analyse with WHOLESOME
          </h1>
        </div>
      </div>
    </header>
  );
}
