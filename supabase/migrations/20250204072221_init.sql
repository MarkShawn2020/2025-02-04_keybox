-- Create tables
-- Drop existing tables if they exist
drop table if exists keys cascade;
drop table if exists key_groups cascade;
drop table if exists platforms cascade;

-- Create tables with proper relationships
create table platforms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  description text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table key_groups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  platform_id uuid not null references platforms(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  key_group_id uuid not null references key_groups(id) on delete cascade,
  value text not null,
  note text,
  revoked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists platforms_user_id_idx on platforms(user_id);
create index if not exists key_groups_user_id_idx on key_groups(user_id);
create index if not exists key_groups_platform_id_idx on key_groups(platform_id);
create index if not exists keys_user_id_idx on keys(user_id);
create index if not exists keys_key_group_id_idx on keys(key_group_id);

-- Enable RLS
alter table platforms enable row level security;
alter table key_groups enable row level security;
alter table keys enable row level security;

-- Drop existing policies
drop policy if exists "Users can view their own platforms" on platforms;
drop policy if exists "Users can insert their own platforms" on platforms;
drop policy if exists "Users can update their own platforms" on platforms;
drop policy if exists "Users can delete their own platforms" on platforms;

drop policy if exists "Users can view their own key groups" on key_groups;
drop policy if exists "Users can insert their own key groups" on key_groups;
drop policy if exists "Users can update their own key groups" on key_groups;
drop policy if exists "Users can delete their own key groups" on key_groups;

drop policy if exists "Users can view their own keys" on keys;
drop policy if exists "Users can insert their own keys" on keys;
drop policy if exists "Users can update their own keys" on keys;
drop policy if exists "Users can delete their own keys" on keys;

-- Create RLS policies for platforms
create policy "Users can view their own platforms"
  on platforms for select
  using (auth.uid() = user_id);

create policy "Users can insert their own platforms"
  on platforms for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own platforms"
  on platforms for update
  using (auth.uid() = user_id);

create policy "Users can delete their own platforms"
  on platforms for delete
  using (auth.uid() = user_id);

-- Create RLS policies for key_groups
create policy "Users can view their own key groups"
  on key_groups for select
  using (auth.uid() = user_id);

create policy "Users can insert their own key groups"
  on key_groups for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own key groups"
  on key_groups for update
  using (auth.uid() = user_id);

create policy "Users can delete their own key groups"
  on key_groups for delete
  using (auth.uid() = user_id);

-- Create RLS policies for keys
create policy "Users can view their own keys"
  on keys for select
  using (auth.uid() = user_id);

create policy "Users can insert their own keys"
  on keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own keys"
  on keys for update
  using (auth.uid() = user_id);

create policy "Users can delete their own keys"
  on keys for delete
  using (auth.uid() = user_id);
