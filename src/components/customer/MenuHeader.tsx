
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface MenuHeaderProps {
  restaurant: { name: string } | undefined;
  tableNumber: string | undefined;
  cartTotal: number;
  cartItemCount: number;
  onCartClick: () => void;
  sessionTimeLeft: number;
}

const MenuHeader = ({ 
  restaurant, 
  tableNumber, 
  cartTotal, 
  cartItemCount, 
  onCartClick, 
  sessionTimeLeft 
}: MenuHeaderProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#FF5733] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{restaurant?.name || 'Restaurant'}</h1>
                <p className="text-sm text-gray-600">Table {tableNumber}</p>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-bold text-[#FF5733]">₹{cartTotal.toFixed(2)}</p>
              </div>
              <Button
                onClick={onCartClick}
                className="bg-[#FF5733] hover:bg-[#E6492E] relative"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({cartItemCount})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Timer */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-yellow-800 text-center">
            Session expires in: {formatTime(sessionTimeLeft)}
          </p>
        </div>
      </div>
    </>
  );
};

export default MenuHeader;
