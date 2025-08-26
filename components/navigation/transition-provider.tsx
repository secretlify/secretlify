'use client';

import { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
