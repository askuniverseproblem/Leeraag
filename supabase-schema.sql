-- ============================================
-- E-COMMERCE DATABASE SCHEMA FOR SUPABASE
-- (Already run in Supabase — is file ko bas reference/backup ke liye GitHub pe rakhna hai)
-- ============================================

-- 1. PROFILES
create table profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default now()
);

-- 2. PRODUCTS
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  stock integer default 0,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 3. ORDERS
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  total numeric not null,
  status text default 'pending' check (status in ('pending','shipped','delivered','cancelled')),
  address text,
  created_at timestamp with time zone default now()
);

-- 4. ORDER ITEMS
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null,
  price numeric not null
);
