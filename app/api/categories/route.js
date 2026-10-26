import { getPool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getPool();

    const [categories] = await db.query(
      'SELECT id, name FROM categories ORDER BY name ASC'
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);

    return NextResponse.json(
      {
        error: 'Gagal mengambil data kategori',
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
