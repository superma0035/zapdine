
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurants } from '@/hooks/useRestaurants';
import Sidebar from '@/components/Sidebar';
import OverviewDashboard from '@/components/OverviewDashboard';
import TodaysOrdersDashboard from '@/components/TodaysOrdersDashboard';
import MenuItemsDashboard from '@/components/MenuItemsDashboard';
import TablesDashboard from '@/components/TablesDashboard';

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: restaurants } = useRestaurants();
  const [activeTab, setActiveTab] = useState('orders');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50">
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 md:pl-64">
          <main className="p-6 overflow-auto h-full">
            {!restaurant && !profile?.has_restaurant ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to ZapDine!</h2>
                <p className="text-gray-600 mb-6">Create your restaurant to get started with managing orders and menu items.</p>
              </div>
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
            Powered by <span className="font-semibold text-brand-600">SPS Labs</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
