
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

interface MenuGridProps {
  popularItems: MenuItem[];
  filteredItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  isLoading: boolean;
  searchTerm: string;
}

const MenuGrid = ({ popularItems, filteredItems, onAddToCart, isLoading, searchTerm }: MenuGridProps) => {
  if (isLoading) {
    return (
      <div className="lg:col-span-3 text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5733] mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Popular Items */}
      {popularItems.length > 0 && !searchTerm && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Popular Items</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} isPopular />
            ))}
          </div>
        </div>
      )}

      {/* All Menu Items */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {searchTerm ? 'Search Results' : 'All Menu Items'}
        </h2>
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? 'No items match your search' : 'No menu items available'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  isPopular?: boolean;
}

const MenuItemCard = ({ item, onAddToCart, isPopular = false }: MenuItemCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${isPopular ? 'border-orange-200 bg-orange-50' : 'border-brand-100'}`}>
      <CardContent className="p-4">
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#FF5733]">₹{item.price}</span>
          <Button
            onClick={() => onAddToCart(item)}
            className="bg-[#FF5733] hover:bg-[#E6492E] text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuGrid;
