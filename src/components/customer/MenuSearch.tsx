
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  menuItemsCount: number;
  cartItemCount: number;
}

const MenuSearch = ({ searchTerm, onSearchChange, menuItemsCount, cartItemCount }: MenuSearchProps) => {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="font-semibold mb-2">Quick Stats</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Items in menu: {menuItemsCount}</p>
              <p>Items in cart: {cartItemCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuSearch;
