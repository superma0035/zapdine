
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange-600 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Your Order
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm">Add some delicious items from the menu!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-orange-200 p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </Button>
                        <span className="font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right min-w-0">
                        <span className="font-bold text-orange-600 text-lg">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-orange-100 mt-1">
                    {cart.length} item{cart.length !== 1 ? 's' : ''} • 
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} total quantity
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={onPlaceOrder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isPlacingOrder}
                  size="lg"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
                <Button
                  onClick={onGenerateBill}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                  size="lg"
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
