
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

export interface CreateMenuItemData {
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  image_url?: string;
  is_available?: boolean;
  sort_order?: number;
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
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!restaurantId
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemData: CreateMenuItemData) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItemData)
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

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: false })
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success!",
        description: "Menu item deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
        variant: "destructive"
      });
    }
  });
};
