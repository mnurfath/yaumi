-- Add timing attributes for Adhkars
-- Creates: timing_type enum, salah_events table, adhkar_salah_events junction

-- =============================================
-- TIMING TYPE ENUM
-- =============================================
create type public.timing_type as enum ('SPECIFIC_SALAH', 'SPECIFIC_IBADAH', 'GENERAL');
create type public.salah_event_type as enum ('WAJIB', 'SUNNAH', 'IBADAH');

-- =============================================
-- ADD TIMING_TYPE TO ADHKARS
-- =============================================
alter table public.adhkars
  add column if not exists timing_type public.timing_type default 'GENERAL';

-- =============================================
-- SALAH EVENTS TABLE
-- =============================================
create table public.salah_events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  event_type public.salah_event_type not null,
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_salah_events_slug on public.salah_events(slug);
create index idx_salah_events_display_order on public.salah_events(display_order);

-- =============================================
-- JUNCTION TABLE: ADHKAR <-> SALAH EVENT
-- =============================================
create table public.adhkar_salah_events (
  adhkar_id uuid references public.adhkars on delete cascade not null,
  salah_event_id uuid references public.salah_events on delete cascade not null,
  primary key (adhkar_id, salah_event_id)
);

-- Indexes for junction table
create index idx_adhkar_salah_events_adhkar on public.adhkar_salah_events(adhkar_id);
create index idx_adhkar_salah_events_event on public.adhkar_salah_events(salah_event_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.salah_events enable row level security;
alter table public.adhkar_salah_events enable row level security;

-- Salah events: public read, admin write
create policy "Salah events are viewable by everyone"
  on public.salah_events for select
  using (true);

create policy "Only admins can insert salah events"
  on public.salah_events for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update salah events"
  on public.salah_events for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete salah events"
  on public.salah_events for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Junction table: public read, admin write
create policy "Adhkar salah events are viewable by everyone"
  on public.adhkar_salah_events for select
  using (true);

create policy "Only admins can insert adhkar salah events"
  on public.adhkar_salah_events for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete adhkar salah events"
  on public.adhkar_salah_events for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Apply updated_at trigger to salah_events
create trigger set_updated_at
  before update on public.salah_events
  for each row execute procedure public.handle_updated_at();
