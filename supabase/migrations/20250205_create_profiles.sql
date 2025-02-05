create table profiles (
  id uuid references auth.users on delete cascade,
  last_login_at timestamptz,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Users can read their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
