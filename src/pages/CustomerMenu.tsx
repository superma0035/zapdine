
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Minus, ShoppingCart, Search, TrendingUp, Star, Clock, Receipt } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

const CustomerMenu = () => {
  const { restaurantId, tableNumber } = useParams();
  const { data: menuItems, isLoading } = useMenuItems(restaurantId);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [showBillConfirm, setShowBillConfirm] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  // Session timer - 2 hours = 7200 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 7200) { // 2 hours
          handleSessionExpiry();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSessionExpiry = () => {
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please start a new order.",
      variant: "destructive"
    });
    setCart([]);
    setCustomerName('');
    setOrderNotes('');
  };

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchRestaurant = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();
      
      if (error) throw error;
      setRestaurant(data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  // Filter and search menu items
  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  // Popular items (top 3)
  const popularItems = menuItems?.slice(0, 3) || [];

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getCartItemQuantity = (itemId: string) => {
    return cart.find(item => item.id === itemId)?.quantity || 0;
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to your cart",
        variant: "destructive"
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          restaurant_id: restaurantId,
          table_number: tableNumber,
          customer_name: customerName.trim(),
          total_amount: getTotalAmount(),
          notes: orderNotes.trim() || null,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        special_instructions: item.specialInstructions || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Placed Successfully! 🎉",
        description: "Your order has been sent to the kitchen. You'll receive updates soon.",
      });

      // Reset form
      setCart([]);
      setCustomerName('');
      setOrderNotes('');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const generateBill = () => {
    if (cart.length === 0) {
      toast({
        title: "No Items",
        description: "Add items to cart before generating bill",
        variant: "destructive"
      });
      return;
    }

    const billContent = `
      ═══════════════════════════════
              ZAPDINE BILL
      ═══════════════════════════════
      Restaurant: ${restaurant?.name || 'Restaurant'}
      Table: ${tableNumber}
      Customer: ${customerName || 'Guest'}
      Date: ${new Date().toLocaleString()}
      Session Time: ${formatSessionTime(sessionTime)}
      
      ═══════════════════════════════
                    ITEMS
      ═══════════════════════════════
      ${cart.map(item => 
        `${item.name.padEnd(20)} x${item.quantity.toString().padStart(2)} ₹${(item.price * item.quantity).toFixed(2).padStart(8)}`
      ).join('\n')}
      
      ═══════════════════════════════
      TOTAL AMOUNT: ₹${getTotalAmount().toFixed(2)}
      ═══════════════════════════════
      
      Thank you for dining with us!
      Powered by ZapDine
    `;

    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bill-${tableNumber}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // End session
    setCart([]);
    setCustomerName('');
    setOrderNotes('');
    setSessionTime(0);
    setShowBillConfirm(false);
    
    toast({
      title: "Bill Generated",
      description: "Your session has ended. Thank you for dining with us!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF5733] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">Z</span>
          </div>
          <p className="text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E1]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF5733] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#FF5733]">{restaurant?.name || 'Restaurant'}</h1>
                <p className="text-sm text-gray-600">Table {tableNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Session Time</p>
                <p className="text-sm font-mono text-[#FF5733]">{formatSessionTime(sessionTime)}</p>
              </div>
              <Badge variant="outline" className="border-[#FF5733] text-[#FF5733]">
                <ShoppingCart className="w-4 h-4 mr-1" />
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search delicious items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:border-[#FF5733] focus:ring-[#FF5733] border-[#FF5733]/20"
            />
          </div>
        </div>

        {/* Today's Popular Items */}
        {!searchTerm && popularItems.length > 0 && (
          <Card className="border-[#FF5733]/20 mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#FF5733] to-[#FF7F50] text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Today's Popular Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {popularItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF5F3] to-[#FFE8E1] rounded-lg border border-[#FF5733]/10">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-[#FF5733] font-bold">₹{item.price}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">Popular</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="bg-[#FF5733] hover:bg-[#E6492E]"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Info */}
        <Card className="border-[#FF5733]/20 mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#FF5733] to-[#FF7F50] text-white rounded-t-lg">
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="focus:border-[#FF5733] focus:ring-[#FF5733]"
              />
            </div>
            <div>
              <Label htmlFor="orderNotes">Special Notes (Optional)</Label>
              <Textarea
                id="orderNotes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special requests or dietary requirements"
                className="focus:border-[#FF5733] focus:ring-[#FF5733]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems?.map((item) => (
            <Card key={item.id} className="border-[#FF5733]/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#FF5733]">₹{item.price}</span>
                  <div className="flex items-center space-x-2">
                    {getCartItemQuantity(item.id) > 0 ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="border-[#FF5733]/30 hover:border-[#FF5733]"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-[#FF5733]">
                          {getCartItemQuantity(item.id)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="bg-[#FF5733] hover:bg-[#E6492E]"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-[#FF5733] hover:bg-[#E6492E]"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <Card className="border-[#FF5733]/20 sticky bottom-4 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#FF5733] to-[#FF7F50] text-white rounded-t-lg">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-900">{item.name} x{item.quantity}</span>
                    <span className="font-semibold text-[#FF5733]">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-[#FF5733] text-xl">₹{getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={placeOrder}
                  disabled={isPlacingOrder || !customerName.trim()}
                  className="flex-1 bg-[#FF5733] hover:bg-[#E6492E] text-white py-3"
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>
                <Dialog open={showBillConfirm} onOpenChange={setShowBillConfirm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-[#FF5733] text-[#FF5733] hover:bg-[#FF5733] hover:text-white">
                      <Receipt className="w-4 h-4 mr-2" />
                      Generate Bill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>End Session & Generate Bill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Are you sure you want to generate the bill? This will end your current session.</p>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowBillConfirm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={generateBill} className="bg-[#FF5733] hover:bg-[#E6492E]">
                          Generate Bill
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="border-[#FF5733]/20 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-[#FF5733]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#FF5733]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Menu will be available soon'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Powered by <span className="font-semibold text-[#FF5733]">SPS Labs</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerMenu;
