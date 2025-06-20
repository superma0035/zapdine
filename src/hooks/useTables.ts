
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: string;
  qr_code: string | null;
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export const useTables = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('table_number', { ascending: true });

      if (error) throw error;
      return data as Table[];
    },
    enabled: !!restaurantId
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableData: Partial<Table>) => {
      // Generate QR code data (simplified - in real app you'd use a QR library)
      const qrData = `${window.location.origin}/order/${tableData.restaurant_id}/${tableData.table_number}`;
      
      const { data, error } = await supabase
        .from('tables')
        .insert({
          ...tableData,
          qr_code: qrData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables', variables.restaurant_id] });
      toast({
        title: "Success!",
        description: "Table created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create table",
        variant: "destructive"
      });
    }
  });
};
