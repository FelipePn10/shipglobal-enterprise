"use client";

import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface ImportButtonProps {
  onImport: () => Promise<void>;
  isLoading?: boolean;
}

export function ImportButton({ onImport, isLoading }: ImportButtonProps) {
  return (
    <Button
      className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
      onClick={onImport}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      New Import
    </Button>
  );
}