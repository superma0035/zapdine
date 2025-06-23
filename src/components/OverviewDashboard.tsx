
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useTables } from '@/hooks/useTables';
import { useTodaysOrders } from '@/hooks/useOrders';

const OverviewDashboard = () => {
  const { data: restaurants } = useRestaurants();
  const restaurant = restaurants?.[0];
  const { data: menuItems } = useMenuItems(restaurant?.id);
  const { data: tables } = useTables(restaurant?.id);
  const { data: orders } = useTodaysOrders(restaurant?.id);

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const completedOrders = orders?.filter(order => order.status === 'served').length || 0;
  const pendingOrders = orders?.filter(order => ['pending', 'confirmed', 'preparing'].includes(order.status)).length || 0;

  const stats = [
    {
      title: "Today's Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Total Orders",
      value: orders?.length || 0,
      icon: ShoppingBag,
      change: "+5%",
      changeType: "positive" as const
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: CheckCircle,
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      change: "2 urgent",
      changeType: "neutral" as const
    }
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your restaurant today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                    className={stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Restaurant Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="text-amber-600">Restaurant Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Restaurant Name</p>
              <p className="font-semibold">{restaurant?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Menu Items</p>
              <p className="font-semibold">{menuItems?.length || 0} items</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tables</p>
              <p className="font-semibold">{tables?.length || 0} tables</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold">{restaurant?.address || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="text-amber-600">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.customer_name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600">Table {order.table_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total_amount?.toFixed(2)}</p>
                      <Badge variant={
                        order.status === 'served' ? 'default' : 
                        order.status === 'preparing' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No orders today yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
