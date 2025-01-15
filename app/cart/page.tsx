'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentProcessor from '@/components/PaymentProcessor';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeFromCart } = useCartStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-xl text-gray-600">Your cart is empty.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-800 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Total</h2>
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleCheckout}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Proceed to Checkout
              </Button>
            </div>

            {/* Payment Modal */}
            <PaymentProcessor 
              amount={total} 
              items={items}
              isOpen={isPaymentModalOpen}
              onClose={handleClosePaymentModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}