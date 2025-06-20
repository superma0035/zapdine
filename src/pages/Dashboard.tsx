
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Menu, QrCode, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-zapdine-orange rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
            <span className="text-xl font-bold text-zapdine-orange">ZapDine</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">root@gmail.com</span>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
            <p className="text-gray-600">Manage your restaurants, menus, and track orders in real-time</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Restaurants</CardTitle>
                <Building2 className="h-5 w-5 text-zapdine-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <p className="text-xs text-gray-500 mb-3">Active restaurants</p>
                <Button className="w-full bg-zapdine-orange hover:bg-zapdine-orange-dark text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Restaurant
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Menu Items</CardTitle>
                <Menu className="h-5 w-5 text-zapdine-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <p className="text-xs text-gray-500 mb-3">Total menu items</p>
                <Button variant="outline" className="w-full">
                  Manage Menus
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tables</CardTitle>
                <QrCode className="h-5 w-5 text-zapdine-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <p className="text-xs text-gray-500 mb-3">QR-enabled tables</p>
                <Button variant="outline" className="w-full">
                  Manage Tables
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today's Orders</CardTitle>
                <TrendingUp className="h-5 w-5 text-zapdine-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <p className="text-xs text-gray-500 mb-3">Orders received today</p>
                <Button variant="outline" className="w-full">
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Getting Started</CardTitle>
              <p className="text-gray-600">Set up your restaurant to start accepting orders through ZapDine</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Create Your Restaurant</h3>
                  <p className="text-gray-600">Add your restaurant details and upload a logo</p>
                </div>
                <Button className="bg-zapdine-orange hover:bg-zapdine-orange-dark text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Restaurant
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg opacity-50">
                <div>
                  <h3 className="font-semibold text-gray-400 mb-2">2. Build Your Menu</h3>
                  <p className="text-gray-400">Add dishes with photos, descriptions, and prices</p>
                </div>
                <Button variant="outline" disabled className="text-gray-400">
                  Add Menu Items
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg opacity-50">
                <div>
                  <h3 className="font-semibold text-gray-400 mb-2">3. Set Up Tables</h3>
                  <p className="text-gray-400">Generate QR codes for each table in your restaurant</p>
                </div>
                <Button variant="outline" disabled className="text-gray-400">
                  Generate QR Codes
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg opacity-50">
                <div>
                  <h3 className="font-semibold text-gray-400 mb-2">4. Start Receiving Orders</h3>
                  <p className="text-gray-400">Customers can now scan and order from your menu</p>
                </div>
                <Button variant="outline" disabled className="text-gray-400">
                  Go Live
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
