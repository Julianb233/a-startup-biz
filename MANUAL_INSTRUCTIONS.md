# Manual Implementation Instructions

The automated implementation failed because the `DATABASE_URL` environment variable is missing. You must apply the database changes manually to fix the issue where new users cannot access the dashboard.

## 1. Apply the Database Migration

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Go to the **SQL Editor**.
4.  Copy and paste the following SQL code:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

5.  Click **Run**.

## 2. Verify the Fix

1.  Go to your app's registration page (`/register`).
2.  Sign up with a *new* email address.
3.  You should now be redirected to the Dashboard and see it load correctly.
4.  (Optional) Check the `public.users` table in Supabase to confirm the new user record exists.
