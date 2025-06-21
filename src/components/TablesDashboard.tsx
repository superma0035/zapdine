
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2, Download, QrCode } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useTables, useDeleteTable } from '@/hooks/useTables';
import CreateTableModal from '@/components/CreateTableModal';
import QRCode from 'qrcode';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TablesDashboard = () => {
  const { data: restaurants } = useRestaurants();
  const restaurant = restaurants?.[0];
  const { data: tables } = useTables(restaurant?.id);
  const deleteTable = useDeleteTable();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = tables?.filter(table => 
    table.table_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (tableId: string) => {
    try {
      await deleteTable.mutateAsync(tableId);
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const downloadQR = async (table: any) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(table.qr_code, {
        width: 300,
        margin: 2,
      });
      
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `table-${table.table_number}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables & QR Codes</h1>
          <p className="text-gray-600">Manage your restaurant tables and download QR codes</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-500 hover:bg-brand-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-brand-100">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">{tables?.length || 0}</p>
            <p className="text-sm text-gray-600">Total Tables</p>
          </CardContent>
        </Card>
        <Card className="border-brand-100">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {tables?.filter(table => table.is_active).length || 0}
            </p>
            <p className="text-sm text-gray-600">Active Tables</p>
          </CardContent>
        </Card>
        <Card className="border-brand-100">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-brand-600">
              {tables?.reduce((sum, table) => sum + (table.capacity || 0), 0) || 0}
            </p>
            <p className="text-sm text-gray-600">Total Capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table) => (
          <Card key={table.id} className="border-brand-100">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Table {table.table_number}
                    </h3>
                    <p className="text-gray-600">Capacity: {table.capacity} seats</p>
                  </div>
                  <Badge variant={table.is_active ? "default" : "secondary"}>
                    {table.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                {/* QR Code Preview */}
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <QrCode className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">QR Code Available</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => downloadQR(table)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download QR
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Table</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "Table {table.table_number}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(table.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <Card className="border-brand-100">
          <CardContent className="text-center py-12">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tables found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first table'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-500 hover:bg-brand-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Table
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateTableModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        restaurantId={restaurant?.id || ''}
      />
    </div>
  );
};

export default TablesDashboard;
