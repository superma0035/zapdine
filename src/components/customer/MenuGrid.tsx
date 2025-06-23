
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Star, ImageOff } from 'lucide-react';

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
      <div className="lg:col-span-3 text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading delicious menu...</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the latest items</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* Popular Items */}
      {popularItems.length > 0 && !searchTerm && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h2 className="text-2xl font-bold text-gray-900">Today's Popular Items</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} isPopular />
            ))}
          </div>
        </div>
      )}

      {/* All Menu Items */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'All Menu Items'}
        </h2>
        {filteredItems.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageOff className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No items match your search' : 'No menu items available'}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm 
                  ? 'Try searching with different keywords or browse all items' 
                  : 'The restaurant is updating their menu. Please check back later.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      isPopular 
        ? 'border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg' 
        : 'border border-orange-100 hover:border-orange-200'
    }`}>
      <CardContent className="p-0 relative">
        {isPopular && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </div>
          </div>
        )}
        
        {/* Image */}
        <div className="relative h-40 sm:h-48 bg-gray-100 rounded-t-lg overflow-hidden">
          {item.image_url && !imageError ? (
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
              <ImageOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{item.name}</h3>
          {item.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
          
          {/* Price and Add Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
              <span className="text-xs text-gray-500">per item</span>
            </div>
            <Button
              onClick={() => onAddToCart(item)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuGrid;
