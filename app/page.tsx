'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const user = localStorage.getItem('x-user');
        if (user) {
          router.replace('/app');
          return;
        }
      } catch {}
      router.replace('/login');
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);
  return null;
}
