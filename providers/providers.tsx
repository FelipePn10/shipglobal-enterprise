"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toast";
import { ReactNode } from "react";
interface ProvidersProps {
  children: ReactNode;
}
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
