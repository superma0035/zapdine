
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  UtensilsCrossed, 
  QrCode, 
  LogOut, 
  Menu,
  X,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (tab: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      onTabChange(tab);
    }
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'orders', label: "Today's Orders", icon: ShoppingBag },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'tables', label: 'Tables & QR', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-amber-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">Z</span>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-amber-600">ZapDine</h1>
            <p className="text-xs text-gray-600">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-amber-200">
        <div className="mb-4 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-xs text-gray-600">{profile?.email}</p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-amber-200 text-amber-600 hover:bg-amber-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="sm"
          className="bg-white shadow-lg border border-amber-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-4 h-4 text-amber-600" />
          ) : (
            <Menu className="w-4 h-4 text-amber-600" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-amber-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
