
-- Add phone column to profiles table
ALTER TABLE public.profiles ADD COLUMN phone text;

-- Update the existing trigger function to handle phone number from signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$function$;
