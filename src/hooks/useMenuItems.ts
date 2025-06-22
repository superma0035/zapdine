
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
      
      console.log('Fetching menu items for restaurant:', restaurantId);
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
      
      console.log('Menu items fetched:', data?.length || 0);
      return data as MenuItem[];
    },
    enabled: !!restaurantId,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemData: CreateMenuItemData) => {
      console.log('Creating menu item:', menuItemData);
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItemData)
        .select()
        .single();

      if (error) {
        console.error('Error creating menu item:', error);
        throw error;
      }
      
      console.log('Menu item created:', data);
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
      console.error('Create menu item error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create menu item. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      console.log('Deleting menu item:', itemId);
      
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: false })
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting menu item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast({
        title: "Success!",
        description: "Menu item deleted successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Delete menu item error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  });
};
