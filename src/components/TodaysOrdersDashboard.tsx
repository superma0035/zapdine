
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChefHat, 
  Search,
  MessageSquare
} from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useTodaysOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TodaysOrdersDashboard = () => {
  const { data: restaurants } = useRestaurants();
  const restaurant = restaurants?.[0];
  const { data: orders } = useTodaysOrders(restaurant?.id);
  const updateOrderStatus = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredOrders = orders?.filter(order => 
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.table_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: status as any });
      setSelectedOrder(null);
      setFeedback('');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleReject = async (orderId: string) => {
    if (feedback.trim()) {
      // In a real app, you'd save the feedback to the database
      toast({
        title: "Order Rejected",
        description: `Order rejected with feedback: ${feedback}`,
      });
    }
    await handleStatusUpdate(orderId, 'cancelled');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'served': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'preparing': return ChefHat;
      case 'ready': return CheckCircle;
      case 'served': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const statusCounts = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    ready: filteredOrders.filter(o => o.status === 'ready').length,
    served: filteredOrders.filter(o => o.status === 'served').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today's Orders</h1>
          <p className="text-gray-600">Manage and track all orders for today</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const Icon = getStatusIcon(status);
          return (
            <Card key={status} className="border-brand-100">
              <CardContent className="p-4 text-center">
                <Icon className="w-6 h-6 mx-auto mb-2 text-brand-600" />
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status || 'pending');
          return (
            <Card key={order.id} className="border-brand-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                  <Badge className={getStatusColor(order.status || 'pending')}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {order.status || 'pending'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Customer: {order.customer_name || 'Anonymous'}</p>
                  <p>Table: {order.table_number}</p>
                  <p>Time: {new Date(order.created_at!).toLocaleTimeString()}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg text-brand-600">
                    Total: ${order.total_amount?.toFixed(2)}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      Note: {order.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updateOrderStatus.isPending}
                      >
                        Accept
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Order</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Optional feedback for customer..."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(order.id)}
                                disabled={updateOrderStatus.isPending}
                              >
                                Reject Order
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'preparing')}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={updateOrderStatus.isPending}
                    >
                      Start Preparing
                    </Button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'ready')}
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={updateOrderStatus.isPending}
                    >
                      Mark Ready
                    </Button>
                  )}
                  
                  {order.status === 'ready' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'served')}
                      className="bg-brand-600 hover:bg-brand-700"
                      disabled={updateOrderStatus.isPending}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="border-brand-100">
          <CardContent className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No orders have been placed today yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TodaysOrdersDashboard;
