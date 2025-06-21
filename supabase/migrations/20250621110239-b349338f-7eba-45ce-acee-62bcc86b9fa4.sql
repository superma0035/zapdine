
-- Add a column to track if restaurant is created (to disable button after first creation)
ALTER TABLE profiles ADD COLUMN has_restaurant boolean DEFAULT false;

-- Create a trigger to update has_restaurant when a restaurant is created
CREATE OR REPLACE FUNCTION update_user_has_restaurant()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET has_restaurant = true 
  WHERE id = NEW.owner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_user_has_restaurant();

-- Add username column to profiles
ALTER TABLE profiles ADD COLUMN username text;
