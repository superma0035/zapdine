
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateTable } from '@/hooks/useTables';
import { toast } from '@/components/ui/use-toast';

interface CreateTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
}

const CreateTableModal = ({ open, onOpenChange, restaurantId }: CreateTableModalProps) => {
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  
  const createTable = useCreateTable();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableNumber.trim()) {
      toast({
        title: "Error",
        description: "Table number is required",
        variant: "destructive"
      });
      return;
    }

    const capacityNumber = parseInt(capacity);
    if (isNaN(capacityNumber) || capacityNumber <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid capacity",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTable.mutateAsync({
        restaurant_id: restaurantId,
        table_number: tableNumber.trim(),
        capacity: capacityNumber
      });
      
      // Reset form
      setTableNumber('');
      setCapacity('4');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-brand-600">Add Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table Number *</Label>
            <Input
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g., T1, A5, Table 1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Number of seats"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTable.isPending}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {createTable.isPending ? 'Creating...' : 'Create Table'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTableModal;
