import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

const CustomerMenu = () => {
  const { restaurantId, tableNumber } = useParams<{ restaurantId: string; tableNumber: string }>();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(3600); // 1 hour in seconds
  const [showBillDialog, setShowBillDialog] = useState(false);

  const fetchMenuItems = async () => {
    if (!restaurantId) return [];
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
    return data as MenuItem[];
  };

  const { data: fetchedMenuItems, isLoading: menuItemsLoading } = useQuery(
    ['menuItems', restaurantId],
    fetchMenuItems
  );

  const fetchRestaurant = async () => {
    if (!restaurantId) return null;
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
    return data;
  };

  const { data: fetchedRestaurant } = useQuery(
    ['restaurant', restaurantId],
    fetchRestaurant
  );

  useEffect(() => {
    if (fetchedMenuItems) {
      setMenuItems(fetchedMenuItems);
    }
  }, [fetchedMenuItems]);

  useEffect(() => {
    if (fetchedRestaurant) {
      setRestaurant(fetchedRestaurant);
    }
  }, [fetchedRestaurant]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sessionTimeLeft === 0) {
      alert('Session has expired. You will be redirected.');
      navigate('/');
    }
  }, [sessionTimeLeft, navigate]);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.id !== itemId));
    } else {
      setCart(
        cart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description?.toLowerCase()?.includes(searchTerm.toLowerCase()))
  );

  const popularItems = menuItems.slice(0, 3);

  const placeOrderMutation = useMutation(
    async () => {
      // Simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Order placed successfully!');
      setCart([]);
      setShowCart(false);
    }
  );

  const placeOrder = () => {
    placeOrderMutation.mutate();
  };

  const generateBill = () => {
    alert('Bill generated! Total amount: ₹' + cartTotal.toFixed(2));
    setShowBillDialog(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E1]">
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
                onClick={() => setShowCart(true)}
                className="bg-[#FF5733] hover:bg-[#E6492E] relative"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Timer */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-yellow-800 text-center">
            Session expires in: {Math.floor(sessionTimeLeft / 60)}:{(sessionTimeLeft % 60).toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Search and Filters */}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Categories would go here if implemented */}
                <div>
                  <h4 className="font-semibold mb-2">Quick Stats</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Items in menu: {menuItems?.length || 0}</p>
                    <p>Items in cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3 space-y-6">
            {/* Popular Items */}
            {popularItems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Popular Items</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {popularItems.map((item) => (
                    <Card key={item.id} className="border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#FF5733]">₹{item.price}</span>
                          <Button
                            onClick={() => addToCart(item)}
                            className="bg-[#FF5733] hover:bg-[#E6492E] text-white"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Menu Items */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Menu Items</h2>
              {menuItemsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5733] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading menu...</p>
                </div>
              ) : filteredItems.length === 0 ? (
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
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#FF5733]">₹{item.price}</span>
                          <Button
                            onClick={() => addToCart(item)}
                            className="bg-[#FF5733] hover:bg-[#E6492E] text-white"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
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
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                    onClick={placeOrder}
                    className="flex-1 bg-[#FF5733] hover:bg-[#E6492E] text-white"
                    disabled={placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                  </Button>
                  <Button
                    onClick={() => setShowBillDialog(true)}
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

      {/* Bill Generation Dialog */}
      <AlertDialog open={showBillDialog} onOpenChange={setShowBillDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Bill & End Session</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate your final bill and end your dining session. 
              Total amount: ₹{cartTotal.toFixed(2)}
              
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={generateBill}
              className="bg-[#FF5733] hover:bg-[#E6492E]"
            >
              Generate Bill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerMenu;
