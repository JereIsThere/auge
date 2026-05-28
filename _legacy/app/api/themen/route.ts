import { NextResponse } from 'next/server';
import { alleThemenLaden } from '@/lib/orientdb';

export async function GET() {
  try {
    const themen = await alleThemenLaden();
    return NextResponse.json(themen);
  } catch (err) {
    console.error('[GET /api/themen]', err);
    return NextResponse.json({ fehler: 'Datenbankfehler' }, { status: 500 });
  }
}
