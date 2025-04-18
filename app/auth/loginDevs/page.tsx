'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Suspense, useEffect, useState } from 'react';

const LoginDevsContent = () => {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get('callbackUrl') || '/dashboard';
    setCallbackUrl(url);
  }, []);

  const handleDevLogin = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email: 'dev@example.com',
      password: 'devbypass',
      callbackUrl,
    });

    if (!result?.error) {
      router.push(callbackUrl);
    } else {
      console.error('Dev login failed:', result.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Developer Login</h1>
      <Button onClick={handleDevLogin}>Login as Developer</Button>
      <p className="mt-4 text-sm text-gray-500">
        This is a development-only login bypass
      </p>
    </div>
  );
};

export default function LoginDevsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginDevsContent />
    </Suspense>
  );
}