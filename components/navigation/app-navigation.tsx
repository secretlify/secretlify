'use client';

import { FloatingDock } from './floating-dock';
import { Cat, Dog, User, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function useUser(pathname: string | null) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Re-read on route change to capture user switches when navigating via login
    try {
      const stored = localStorage.getItem('x-user');
      setUserName(stored ?? null);
    } catch {
      setUserName(null);
    }
  }, [pathname]);

  return userName;
}

export function AppNavigation() {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith('/app');
  const navItems = [
    {
      title: 'Page A',
      icon: (
        <Cat className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/app/page-a',
    },
    {
      title: 'Page B',
      icon: (
        <Dog className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/app/page-b',
    },
  ];

  return (
    <AnimatePresence>
      {isAppRoute && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        >
          <FloatingDock items={navItems} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
