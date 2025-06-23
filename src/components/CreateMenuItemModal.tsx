
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateMenuItem } from '@/hooks/useMenuItems';
import { toast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';

interface CreateMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
}

const CreateMenuItemModal = ({ open, onOpenChange, restaurantId }: CreateMenuItemModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const createMenuItem = useCreateMenuItem();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !price) {
      toast({
        title: "Error",
        description: "Name and price are required",
        variant: "destructive"
      });
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    try {
      let finalImageUrl = imageUrl;
      
      // Upload image if file is selected
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile) || '';
      }

      await createMenuItem.mutateAsync({
        restaurant_id: restaurantId,
        name: name.trim(),
        description: description.trim() || null,
        price: priceNumber,
        image_url: finalImageUrl || null,
        category_id: null,
        is_available: true,
        sort_order: 0
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImageUrl('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImageUrl(''); // Clear URL input when file is selected
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-600">Add Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <ImageUpload
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            disabled={isUploading || createMenuItem.isPending}
          />
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Or Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={!!imageFile}
            />
            {imageFile && (
              <p className="text-sm text-gray-500">
                File upload selected. Clear the file to use URL instead.
              </p>
            )}
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
              disabled={createMenuItem.isPending || isUploading}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {createMenuItem.isPending || isUploading ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuItemModal;
