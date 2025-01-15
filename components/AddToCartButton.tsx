import { Product } from '@/types';
import { useCartStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <motion.button
      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </motion.button>
  );
}

