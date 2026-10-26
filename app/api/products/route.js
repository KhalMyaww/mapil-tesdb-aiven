
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/products
export async function GET() {
  try {
    const pool = getPool();

    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.category_id,
        c.name AS category_name,
        p.description,
        p.price,
        p.created_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category_id, description, price } = body;

    if (!name || price === undefined || price === '') {
      return NextResponse.json(
        { error: 'Field nama dan harga wajib diisi' },
        { status: 400 }
      );
    }

    if (category_id === undefined || category_id === '') {
      return NextResponse.json(
        { error: 'Kategori wajib dipilih' },
        { status: 400 }
      );
    }

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO products
        (name, category_id, description, price)
       VALUES (?, ?, ?, ?)`,
      [name, Number(category_id), description || null, price]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        name,
        category_id: Number(category_id),
        category_name: null,
        description,
        price,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
