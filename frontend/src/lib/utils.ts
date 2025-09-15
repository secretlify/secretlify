import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function defaultLoader() {
  await new Promise((resolve) => setTimeout(resolve, 200));
}

export function randomId() {
  return Math.random().toString(36).slice(2, 8);
}
