import { NextResponse } from 'next/server';

export async function GET() {
  const value = Math.floor(Math.random() * 11);
  return NextResponse.json({ value });
}
