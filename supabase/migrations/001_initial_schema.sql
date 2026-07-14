-- Yaumi MVP - Initial Database Schema
-- Run this in Supabase SQL Editor

-- gen_random_uuid() is built-in in PostgreSQL 13+ (no extension needed)

-- Create custom types
create type public.app_role as enum ('admin', 'user');

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  role app_role default 'user' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- CATEGORIES TABLE
-- =============================================
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on slug for fast lookups
create index idx_categories_slug on public.categories(slug);
create index idx_categories_display_order on public.categories(display_order);

-- =============================================
-- ADHKARS TABLE
-- =============================================
create table public.adhkars (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories on delete cascade not null,
  title text not null,
  arabic_text text not null,
  latin_transliteration text,
  english_translation text,
  recitation_context text,
  target_count integer default 1 not null,
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index idx_adhkars_category_id on public.adhkars(category_id);
create index idx_adhkars_display_order on public.adhkars(display_order);

-- =============================================
-- USER PROGRESS TABLE
-- =============================================
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  adhkar_id uuid references public.adhkars on delete cascade not null,
  date date default current_date not null,
  completed_count integer default 0 not null,
  is_completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Unique constraint: one progress record per user per adhkar per day
  unique(user_id, adhkar_id, date)
);

-- Create indexes for fast progress lookups
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_date on public.user_progress(date);
create index idx_user_progress_user_date on public.user_progress(user_id, date);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.adhkars enable row level security;
alter table public.user_progress enable row level security;

-- PROFILES policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- CATEGORIES policies (public read, admin write)
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Only admins can insert categories"
  on public.categories for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update categories"
  on public.categories for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete categories"
  on public.categories for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ADHKARS policies (public read, admin write)
create policy "Adhkars are viewable by everyone"
  on public.adhkars for select
  using (true);

create policy "Only admins can insert adhkars"
  on public.adhkars for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update adhkars"
  on public.adhkars for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete adhkars"
  on public.adhkars for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- USER PROGRESS policies (users can only see/edit own progress)
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Admins can view all progress
create policy "Admins can view all progress"
  on public.user_progress for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Apply updated_at triggers
create trigger set_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.adhkars
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.user_progress
  for each row execute procedure public.handle_updated_at();
