
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onPlaceOrder: () => void;
  onGenerateBill: () => void;
  isPlacingOrder: boolean;
}

const CartModal = ({
  open,
  onOpenChange,
  cart,
  cartTotal,
  onUpdateQuantity,
  onPlaceOrder,
  onGenerateBill,
  isPlacingOrder
}: CartModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#FF5733]">Your Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-600 py-8">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-[#FF5733] font-bold w-16 text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-[#FF5733]">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={onPlaceOrder}
                  className="flex-1 bg-[#FF5733] hover:bg-[#E6492E] text-white"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>
                <Button
                  onClick={onGenerateBill}
                  variant="outline"
                  className="border-[#FF5733] text-[#FF5733]"
                >
                  Generate Bill
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
