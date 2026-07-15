-- Add icon column to categories for per-category icon selection (admin-managed)
alter table public.categories
  add column if not exists icon text;