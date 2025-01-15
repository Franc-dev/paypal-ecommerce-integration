"use client";
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          My Store
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/cart">Cart ({itemCount})</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

