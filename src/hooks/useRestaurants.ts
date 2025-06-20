
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    }
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurantData: Partial<Restaurant>) => {
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurantData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast({
        title: "Success!",
        description: "Restaurant created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create restaurant",
        variant: "destructive"
      });
    }
  });
};
