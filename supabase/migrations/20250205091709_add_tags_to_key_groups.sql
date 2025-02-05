-- Add tags column to key_groups table
alter table key_groups add column if not exists tags text[];