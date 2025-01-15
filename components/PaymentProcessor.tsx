'use client';

import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCartStore } from '@/lib/store';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { CartItem, PaymentSuccessDetails } from '@/types';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { X } from 'lucide-react';

interface PaymentProcessorProps {
  amount: number;
  items: CartItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function PaymentProcessor({ 
  amount, 
  items, 
  isOpen = true, 
  onClose 
}: PaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { clearCart } = useCartStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || amount <= 0) return null;

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    console.error('PayPal Client ID is not configured');
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-red-600">Configuration Error</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Payment system configuration error. Please contact support.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePaymentSuccess = async (details: PaymentSuccessDetails & { id: string }) => {
    try {
      setIsProcessing(true);
      
      console.log('Payment successful:', details);
      
      clearCart();
      toast.success('Payment successful! Thank you for your purchase.');
      onClose?.();
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentContent = (
    <div className="relative w-full">
      {isProcessing && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <PulseLoader color="#4F46E5" size={12} />
              <p className="mt-4 text-gray-600 font-medium">Processing your payment...</p>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="h-full max-h-[80vh]">
        <div className="space-y-6 pr-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Items ({items.length})</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span className="text-gray-900">${amount.toFixed(2)}</span>
            </div>
          </div>

          {/* PayPal Buttons */}
          {scriptError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{scriptError}</p>
              <button 
                onClick={() => setScriptError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          ) : (
            <PayPalScriptProvider 
              options={{ 
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: "USD",
                intent: "capture",
                components: "buttons"
              }}
            >
              <div className={`w-full ${isMobile ? 'px-2' : 'px-4'}`}>
                <PayPalButtons
                  style={{ 
                    layout: "vertical",
                    shape: "rect",
                    height: isMobile ? 35 : 45,
                  }}
                  createOrder={(_, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        amount: {
                          currency_code: "USD",
                          value: amount.toFixed(2),
                        },
                        description: `Order of ${items.length} item(s)`
                      }],
                    });
                  }}
                  onApprove={async (_, actions) => {
                    if (!actions.order) {
                      throw new Error('Order is undefined');
                    }
                    const details = await actions.order.capture() as PaymentSuccessDetails & { id: string };
                    await handlePaymentSuccess(details);
                  }}
                  onError={(err) => {
                    console.error('PayPal payment error:', err);
                    toast.error('Payment failed. Please try again or contact support.');
                  }}
                  onCancel={() => {
                    toast('Payment cancelled. Your cart items are still saved.');
                    onClose?.();
                  }}
                />
              </div>
            </PayPalScriptProvider>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // For modal presentation
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-between mb-4">
            <VisuallyHidden>
              <DialogTitle>Complete Your Purchase</DialogTitle>
            </VisuallyHidden>
            <h2 className="text-lg font-semibold text-gray-900">Complete Your Purchase</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {paymentContent}
        </DialogContent>
      </Dialog>
    );
  }

  // For inline presentation
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {paymentContent}
    </div>
  );
}