
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Menu, ShoppingCart } from 'lucide-react';

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  menuItemsCount: number;
  cartItemCount: number;
}

const MenuSearch = ({ searchTerm, onSearchChange, menuItemsCount, cartItemCount }: MenuSearchProps) => {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24 shadow-lg border-orange-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-orange-500" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <Menu className="w-4 h-4" />
              Quick Stats
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Menu items
                </span>
                <span className="font-semibold text-gray-800">{menuItemsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <ShoppingCart className="w-3 h-3" />
                  In your cart
                </span>
                <span className="font-semibold text-orange-600">{cartItemCount}</span>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Search active:</span> "{searchTerm}"
              </p>
            </div>
          )}

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <p className="mb-1"><strong>Tip:</strong> Use the search to quickly find your favorite dishes!</p>
            <p>Popular items are highlighted at the top of the menu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuSearch;
