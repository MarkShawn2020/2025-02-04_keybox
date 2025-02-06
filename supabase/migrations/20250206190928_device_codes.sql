create table if not exists device_codes (
  id uuid primary key default gen_random_uuid(),
  device_code text not null unique,
  user_code text not null unique,
  callback_url text not null,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null,
  verified_at timestamp with time zone,
  verified_by uuid references auth.users(id)
);
