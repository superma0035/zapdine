
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useMenuItems, useDeleteMenuItem } from '@/hooks/useMenuItems';
import CreateMenuItemModal from '@/components/CreateMenuItemModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MenuItemsDashboard = () => {
  const { data: restaurants } = useRestaurants();
  const restaurant = restaurants?.[0];
  const { data: menuItems } = useMenuItems(restaurant?.id);
  const deleteMenuItem = useDeleteMenuItem();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (itemId: string) => {
    try {
      await deleteMenuItem.mutateAsync(itemId);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-500 hover:bg-brand-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-brand-100">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">{menuItems?.length || 0}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </CardContent>
        </Card>
        <Card className="border-brand-100">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {menuItems?.filter(item => item.is_available).length || 0}
            </p>
            <p className="text-sm text-gray-600">Available Items</p>
          </CardContent>
        </Card>
        <Card className="border-brand-100">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-brand-600">
              ${((menuItems?.reduce((sum, item) => sum + item.price, 0) || 0) / (menuItems?.length || 1)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Average Price</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-brand-100">
            <CardContent className="p-6">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <Badge variant={item.is_available ? "default" : "secondary"}>
                    {item.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                
                {item.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-brand-600">${item.price}</span>
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="border-brand-100">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first menu item'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-500 hover:bg-brand-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateMenuItemModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        restaurantId={restaurant?.id || ''}
      />
    </div>
  );
};

export default MenuItemsDashboard;
