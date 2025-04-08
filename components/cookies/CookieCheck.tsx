'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CookieCheck() {
  const router = useRouter();

  useEffect(() => {
    if (!navigator.cookieEnabled) {
      alert('Por favor, habilite os cookies para usar esta aplicação!');
      router.push('/auth/cookie-error');
    }
  }, []);

  return null;
}