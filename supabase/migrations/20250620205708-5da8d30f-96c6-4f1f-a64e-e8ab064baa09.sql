
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create menu categories table
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create tables table for QR management
CREATE TABLE public.tables (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  qr_code TEXT,
  capacity INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(restaurant_id, table_number)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES public.tables(id) ON DELETE SET NULL,
  table_number TEXT,
  customer_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled')),
  total_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for restaurants
CREATE POLICY "Users can view own restaurants" ON public.restaurants
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own restaurants" ON public.restaurants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own restaurants" ON public.restaurants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own restaurants" ON public.restaurants
  FOR DELETE USING (auth.uid() = owner_id);

-- Create RLS policies for menu categories
CREATE POLICY "Users can manage menu categories of own restaurants" ON public.menu_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_categories.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Create RLS policies for menu items
CREATE POLICY "Users can manage menu items of own restaurants" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Create RLS policies for tables
CREATE POLICY "Users can manage tables of own restaurants" ON public.tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = tables.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Create RLS policies for orders
CREATE POLICY "Users can view orders of own restaurants" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = orders.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update orders of own restaurants" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = orders.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Create RLS policies for order items
CREATE POLICY "Users can view order items of own restaurants" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      JOIN public.restaurants ON restaurants.id = orders.restaurant_id
      WHERE orders.id = order_items.order_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
