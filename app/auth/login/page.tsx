'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleDevLogin = async () => {
    // This will work with our modified auth.ts
    const result = await signIn('credentials', {
      redirect: false,
      email: 'dev@example.com',
      password: 'devbypass',
      callbackUrl,
    });

    if (!result?.error) {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Development Login</h1>
      <Button onClick={handleDevLogin}>Login as Developer</Button>
      <p className="mt-4 text-sm text-gray-500">
        This is a development-only login bypass
      </p>
    </div>
  );
}