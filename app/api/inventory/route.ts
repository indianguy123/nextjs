// app/api/inventory/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://dev.electorq.com/dummy/inventory');
  const data = await res.json();
  console.log('API raw response:', data);
  return NextResponse.json(data);
}
