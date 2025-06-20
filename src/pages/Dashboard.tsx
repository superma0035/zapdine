
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Menu, QrCode, TrendingUp, Plus, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useTables } from "@/hooks/useTables";
import { useTodaysOrders } from "@/hooks/useOrders";
import CreateRestaurantModal from "@/components/CreateRestaurantModal";
import CreateMenuItemModal from "@/components/CreateMenuItemModal";
import CreateTableModal from "@/components/CreateTableModal";
import QRCode from 'qrcode';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants();
  const selectedRestaurant = restaurants?.[0]; // Use first restaurant for demo
  const { data: menuItems } = useMenuItems(selectedRestaurant?.id);
  const { data: tables } = useTables(selectedRestaurant?.id);
  const { data: todaysOrders } = useTodaysOrders(selectedRestaurant?.id);

  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);
  const [showCreateMenuItem, setShowCreateMenuItem] = useState(false);
  const [showCreateTable, setShowCreateTable] = useState(false);

  const downloadQRCode = async (tableId: string, tableNumber: string) => {
    try {
      const qrData = `${window.location.origin}/order/${selectedRestaurant?.id}/${tableNumber}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#FF5733',
          light: '#FFFFFF'
        }
      });

      // Create download link
      const link = document.createElement('a');
      link.href = qrCodeDataURL;
      link.download = `table-${tableNumber}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (loadingRestaurants) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">Z</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
            <span className="text-xl font-bold text-brand-600">ZapDine</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="text-gray-600 hover:text-gray-800 border-brand-200 hover:border-brand-300"
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
            <Card className="border-brand-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Restaurants</CardTitle>
                <Building2 className="h-5 w-5 text-brand-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{restaurants?.length || 0}</div>
                <p className="text-xs text-gray-500 mb-3">Active restaurants</p>
                <Button 
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={() => setShowCreateRestaurant(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Restaurant
                </Button>
              </CardContent>
            </Card>

            <Card className="border-brand-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Menu Items</CardTitle>
                <Menu className="h-5 w-5 text-brand-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{menuItems?.length || 0}</div>
                <p className="text-xs text-gray-500 mb-3">Total menu items</p>
                <Button 
                  variant="outline" 
                  className="w-full border-brand-200 hover:border-brand-300"
                  onClick={() => setShowCreateMenuItem(true)}
                  disabled={!selectedRestaurant}
                >
                  Add Menu Items
                </Button>
              </CardContent>
            </Card>

            <Card className="border-brand-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tables</CardTitle>
                <QrCode className="h-5 w-5 text-brand-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{tables?.length || 0}</div>
                <p className="text-xs text-gray-500 mb-3">QR-enabled tables</p>
                <Button 
                  variant="outline" 
                  className="w-full border-brand-200 hover:border-brand-300"
                  onClick={() => setShowCreateTable(true)}
                  disabled={!selectedRestaurant}
                >
                  Add Tables
                </Button>
              </CardContent>
            </Card>

            <Card className="border-brand-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today's Orders</CardTitle>
                <TrendingUp className="h-5 w-5 text-brand-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{todaysOrders?.length || 0}</div>
                <p className="text-xs text-gray-500 mb-3">Orders received today</p>
                <Button 
                  variant="outline" 
                  className="w-full border-brand-200 hover:border-brand-300"
                >
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Restaurant Details */}
          {selectedRestaurant && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-brand-100">
                <CardHeader>
                  <CardTitle className="text-brand-600">Restaurant Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedRestaurant.name}</p>
                      <p className="text-gray-600">{selectedRestaurant.description}</p>
                    </div>
                    {selectedRestaurant.address && (
                      <p className="text-gray-600"><strong>Address:</strong> {selectedRestaurant.address}</p>
                    )}
                    {selectedRestaurant.phone && (
                      <p className="text-gray-600"><strong>Phone:</strong> {selectedRestaurant.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-brand-100">
                <CardHeader>
                  <CardTitle className="text-brand-600">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-brand-500 hover:bg-brand-600"
                    onClick={() => setShowCreateMenuItem(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                  <Button 
                    className="w-full bg-brand-500 hover:bg-brand-600"
                    onClick={() => setShowCreateTable(true)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Add Table
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tables with QR Download */}
          {tables && tables.length > 0 && (
            <Card className="border-brand-100 mb-8">
              <CardHeader>
                <CardTitle className="text-brand-600">Tables & QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tables.map((table) => (
                    <div key={table.id} className="border border-brand-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Table {table.table_number}</h3>
                        <span className="text-sm text-gray-500">Capacity: {table.capacity}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => downloadQRCode(table.id, table.table_number)}
                        className="w-full bg-brand-500 hover:bg-brand-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Getting Started Section */}
          {!selectedRestaurant && (
            <Card className="border-brand-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Getting Started</CardTitle>
                <p className="text-gray-600">Set up your restaurant to start accepting orders through ZapDine</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-brand-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">1. Create Your Restaurant</h3>
                    <p className="text-gray-600">Add your restaurant details and upload a logo</p>
                  </div>
                  <Button 
                    className="bg-brand-500 hover:bg-brand-600 text-white"
                    onClick={() => setShowCreateRestaurant(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Restaurant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Powered by <span className="font-semibold text-brand-600">SPS Labs</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CreateRestaurantModal 
        open={showCreateRestaurant} 
        onOpenChange={setShowCreateRestaurant}
      />
      {selectedRestaurant && (
        <>
          <CreateMenuItemModal 
            open={showCreateMenuItem} 
            onOpenChange={setShowCreateMenuItem}
            restaurantId={selectedRestaurant.id}
          />
          <CreateTableModal 
            open={showCreateTable} 
            onOpenChange={setShowCreateTable}
            restaurantId={selectedRestaurant.id}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
