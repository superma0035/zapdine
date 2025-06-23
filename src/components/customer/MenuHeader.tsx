
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Wifi, WifiOff } from 'lucide-react';

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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = sessionTimeLeft < 300; // Less than 5 minutes

  return (
    <>
      {/* Main Header */}
      <div className="bg-white shadow-lg sticky top-0 z-20 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Restaurant Info */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {restaurant?.name?.charAt(0) || 'R'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {restaurant?.name || 'Restaurant'}
                </h1>
                <p className="text-sm text-gray-600">Table {tableNumber}</p>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold text-orange-600">₹{cartTotal.toFixed(2)}</p>
              </div>
              <Button
                onClick={onCartClick}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg relative px-3 sm:px-4"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Cart</span>
                <span className="sm:hidden">({cartItemCount})</span>
                <span className="hidden sm:inline">({cartItemCount})</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Cart Total */}
          <div className="sm:hidden mt-2 text-center">
            <p className="text-lg font-bold text-orange-600">Total: ₹{cartTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Session Timer */}
      <div className={`px-4 py-2 transition-colors duration-300 ${
        isLowTime 
          ? 'bg-red-50 border-b border-red-200' 
          : 'bg-yellow-50 border-b border-yellow-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isLowTime ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
            }`}></div>
            <p className={`text-sm font-medium ${
              isLowTime ? 'text-red-800' : 'text-yellow-800'
            }`}>
              Session expires in: {formatTime(sessionTimeLeft)}
              {isLowTime && ' - Please complete your order soon!'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuHeader;
