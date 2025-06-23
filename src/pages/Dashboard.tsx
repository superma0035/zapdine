
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurants } from '@/hooks/useRestaurants';
import CreateRestaurantModal from '@/components/CreateRestaurantModal';
import Sidebar from '@/components/Sidebar';
import OverviewDashboard from '@/components/OverviewDashboard';
import TodaysOrdersDashboard from '@/components/TodaysOrdersDashboard';
import MenuItemsDashboard from '@/components/MenuItemsDashboard';
import TablesDashboard from '@/components/TablesDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus } from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: restaurants } = useRestaurants();
  const [activeTab, setActiveTab] = useState('orders');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const restaurant = restaurants?.[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'menu':
        return <MenuItemsDashboard />;
      case 'tables':
        return <TablesDashboard />;
      case 'orders':
      default:
        return <TodaysOrdersDashboard />;
    }
  };

  const WelcomeScreen = () => (
    <div className="max-w-4xl mx-auto text-center py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
        <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Store className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ZapDine!</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          You're just one step away from revolutionizing your restaurant's dining experience. 
          Let's get your restaurant set up with our QR-powered ordering system.
        </p>
        
        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-white text-xl">What you'll get:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <p>✓ QR code menu for each table</p>
                <p>✓ Real-time order management</p>
                <p>✓ Digital menu builder</p>
              </div>
              <div className="space-y-2">
                <p>✓ Customer order tracking</p>
                <p>✓ Analytics and insights</p>
                <p>✓ Seamless payment integration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Register Your Restaurant
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 md:pl-64">
          <main className="p-6 overflow-auto h-full">
            {!restaurant && !profile?.has_restaurant ? (
              <WelcomeScreen />
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 md:pl-64">
        <div className="px-6">
          <p className="text-center text-gray-600">
            Powered by <span className="font-semibold text-amber-600">SPS Labs</span>
          </p>
        </div>
      </footer>

      <CreateRestaurantModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
};

export default Dashboard;
