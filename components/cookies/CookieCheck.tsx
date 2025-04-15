"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function CookieCheck() {
  const router = useRouter();
  const [cookieError, setCookieError] = useState(false);

  // Check if cookies are enabled on mount
  useEffect(() => {
    if (!navigator.cookieEnabled) {
      setCookieError(true);
    }
  }, []);

  // Redirect to error page if user confirms
  const handleRedirect = () => {
    router.push("/auth/cookie-error");
  };

  // Render nothing if cookies are enabled
  if (!cookieError) {
    return null;
  }

  // Show error UI if cookies are disabled
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md bg-background/95 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            Cookies Desabilitados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-live="polite" className="text-sm text-muted-foreground">
            Por favor, habilite os cookies no seu navegador para usar esta aplicação. Cookies são necessários para autenticação e funcionalidade.
          </div>
          <Button
            variant="default"
            onClick={handleRedirect}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            aria-label="Continuar para a página de erro de cookies"
          >
            Entendido
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}