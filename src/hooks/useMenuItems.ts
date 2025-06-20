
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export const useMenuItems = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['menu-items', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!restaurantId
  });
};

export const useMenuCategories = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['menu-categories', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as MenuCategory[];
    },
    enabled: !!restaurantId
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: Partial<MenuItem>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menu-items', variables.restaurant_id] });
      toast({
        title: "Success!",
        description: "Menu item created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create menu item",
        variant: "destructive"
      });
    }
  });
};
