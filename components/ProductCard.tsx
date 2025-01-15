import { Product } from '@/types';
import { motion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      className="border p-4 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
      <AddToCartButton product={product} />
    </motion.div>
  );
}

