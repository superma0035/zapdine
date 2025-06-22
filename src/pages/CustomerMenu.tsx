
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MenuHeader from '@/components/customer/MenuHeader';
import MenuSearch from '@/components/customer/MenuSearch';
import MenuGrid from '@/components/customer/MenuGrid';
import CartModal from '@/components/customer/CartModal';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerMenu = () => {
  const { restaurantId, tableNumber } = useParams<{ restaurantId: string; tableNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(7200); // 2 hours in seconds
  const [showBillDialog, setShowBillDialog] = useState(false);

  // Validate required params
  if (!restaurantId || !tableNumber) {
    navigate('/');
    return null;
  }

  const fetchMenuItems = async (): Promise<MenuItem[]> => {
    console.log('Fetching menu items for restaurant:', restaurantId);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching menu items:', error);
      throw new Error(`Failed to fetch menu items: ${error.message}`);
    }
    console.log('Menu items fetched:', data?.length || 0);
    return data as MenuItem[];
  };

  const fetchRestaurant = async (): Promise<Restaurant> => {
    console.log('Fetching restaurant:', restaurantId);
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (error) {
      console.error('Error fetching restaurant:', error);
      throw new Error(`Failed to fetch restaurant: ${error.message}`);
    }
    console.log('Restaurant fetched:', data?.name);
    return data as Restaurant;
  };

  const { data: menuItems = [], isLoading: menuItemsLoading, error: menuItemsError } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: fetchMenuItems,
    enabled: !!restaurantId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: restaurant, isLoading: restaurantLoading, error: restaurantError } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: fetchRestaurant,
    enabled: !!restaurantId,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Redirecting to home page.",
            variant: "destructive",
          });
          navigate('/');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, toast]);

  const addToCart = (item: MenuItem) => {
    console.log('Adding to cart:', item.name);
    setCart(prevCart => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.id !== itemId));
    } else {
      setCart(cart.map((item) => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description?.toLowerCase()?.includes(searchTerm.toLowerCase()))
  );

  const popularItems = menuItems.slice(0, 3);

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      console.log('Placing order...');
      
      const orderData = {
        restaurant_id: restaurantId,
        table_number: tableNumber,
        total_amount: cartTotal,
        status: 'pending',
        notes: `Order from Table ${tableNumber}`,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been sent to the kitchen.",
      });
      setCart([]);
      setShowCart(false);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateBill = () => {
    toast({
      title: "Bill Generated",
      description: `Total amount: ₹${cartTotal.toFixed(2)}`,
    });
    setShowBillDialog(false);
    navigate('/');
  };

  // Loading state
  if (restaurantLoading || menuItemsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5733] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (restaurantError || menuItemsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E1] flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4">
              Unable to load the menu. Please check your connection and try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#FF5733] hover:bg-[#E6492E]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E1]">
      <MenuHeader 
        restaurant={restaurant}
        tableNumber={tableNumber}
        cartTotal={cartTotal}
        cartItemCount={cartItemCount}
        onCartClick={() => setShowCart(true)}
        sessionTimeLeft={sessionTimeLeft}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <MenuSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            menuItemsCount={menuItems.length}
            cartItemCount={cartItemCount}
          />

          <MenuGrid 
            popularItems={popularItems}
            filteredItems={filteredItems}
            onAddToCart={addToCart}
            isLoading={menuItemsLoading}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      <CartModal 
        open={showCart}
        onOpenChange={setShowCart}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={() => placeOrderMutation.mutate()}
        onGenerateBill={() => setShowBillDialog(true)}
        isPlacingOrder={placeOrderMutation.isPending}
      />

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
