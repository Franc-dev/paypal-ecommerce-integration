import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you would fetch this data from a database
  const products = [
    { id: 1, name: 'Product 1', price: 19.99, description: 'Description 1' },
    { id: 2, name: 'Product 2', price: 29.99, description: 'Description 2' },
    { id: 3, name: 'Product 3', price: 39.99, description: 'Description 3' },
  ];

  return NextResponse.json(products);
}

