-- ============================================
-- KRYPTICLAB RLS FIX SCRIPT v2
-- Fixes infinite recursion error
-- ============================================

-- ============================================
-- STEP 1: DISABLE RLS TEMPORARILY
-- ============================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable admin read access to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable admin update access to all profiles" ON profiles;

DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable read for users on own orders" ON orders;
DROP POLICY IF EXISTS "Enable admin full access to orders" ON orders;

DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Enable insert for order items" ON order_items;
DROP POLICY IF EXISTS "Enable read for users on own order items" ON order_items;
DROP POLICY IF EXISTS "Enable admin full access to order items" ON order_items;

DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Enable public read access to products" ON products;
DROP POLICY IF EXISTS "Enable admin insert products" ON products;
DROP POLICY IF EXISTS "Enable admin update products" ON products;
DROP POLICY IF EXISTS "Enable admin delete products" ON products;

-- ============================================
-- STEP 3: CREATE SECURITY DEFINER FUNCTION
-- This function avoids RLS recursion by using SECURITY DEFINER
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$;

-- ============================================
-- STEP 4: RE-ENABLE RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE NEW POLICIES (NO RECURSION)
-- ============================================

-- PROFILES: Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- PROFILES: Users can update their own profile  
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- PROFILES: Admins can read all profiles (uses function to avoid recursion)
CREATE POLICY "profiles_admin_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- PROFILES: Admins can update all profiles
CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ============================================
-- ORDERS POLICIES
-- ============================================

-- Anyone can create orders (guest checkout)
CREATE POLICY "orders_insert_any"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own orders
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.email());

-- Admins can do everything with orders
CREATE POLICY "orders_admin_all"
  ON orders FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ============================================
-- ORDER ITEMS POLICIES
-- ============================================

-- Anyone can insert order items
CREATE POLICY "order_items_insert_any"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own order items
CREATE POLICY "order_items_select_own"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid() OR email = auth.email())
  );

-- Admins can do everything with order items
CREATE POLICY "order_items_admin_all"
  ON order_items FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Anyone can view products (public)
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can insert products
CREATE POLICY "products_admin_insert"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Admins can update products
CREATE POLICY "products_admin_update"
  ON products FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Admins can delete products
CREATE POLICY "products_admin_delete"
  ON products FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ============================================
-- DONE! All policies created without recursion
-- ============================================
