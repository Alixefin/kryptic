-- =====================================================
-- CREATE ADMIN USER FOR KRYPTIC
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. First, create a user account by going to your Supabase dashboard:
--    https://supabase.com/dashboard/project/wvykhufmfbkjadfxkixe/auth/users
--    Click "Add user" > "Create new user"
--    Enter your email and password
--
-- 2. After the user is created, copy the user's UUID from the dashboard
--    (it will look like: 12345678-1234-1234-1234-123456789abc)
--
-- 3. Replace 'YOUR_USER_UUID_HERE' below with your actual UUID
--
-- 4. Run this SQL in the SQL Editor:
--    https://supabase.com/dashboard/project/wvykhufmfbkjadfxkixe/sql/new
-- =====================================================

-- Update the user's profile to admin role
-- Replace the UUID with your actual user UUID from step 2
UPDATE profiles 
SET role = 'admin', 
    first_name = 'Admin',
    last_name = 'User'
WHERE id = 'YOUR_USER_UUID_HERE';

-- =====================================================
-- ALTERNATIVE: Create admin directly with specific email
-- =====================================================
-- If you already created the user and know the email, run this instead:
-- (Uncomment and replace with your email)

-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'your-admin-email@example.com';

-- =====================================================
-- VERIFY ADMIN STATUS
-- =====================================================
-- After running the update, verify with this query:

-- SELECT id, email, first_name, last_name, role, created_at 
-- FROM profiles 
-- WHERE role = 'admin';
