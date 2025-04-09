"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toast";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}