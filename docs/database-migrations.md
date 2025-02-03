# 数据库迁移最佳实践

## 表结构变更流程

1. **创建新的迁移文件**
```bash
supabase migration new <migration-name>
```
例如：`supabase migration new reset-tables`

2. **编写迁移文件的注意事项**
- 使用 `drop table if exists ... cascade` 确保清理旧表
- 按照依赖关系顺序创建表（被引用的表先创建）
- 为外键添加 `on delete cascade` 以保持数据一致性
- 为常用查询字段创建索引提高性能
- 为所有表启用 RLS 并设置相应的策略

3. **表结构设计规范**
```sql
-- 主表设计模板
create table main_table (
  id uuid default gen_random_uuid() primary key,  -- 使用 UUID 作为主键
  user_id uuid references auth.users(id),         -- 用户关联
  name text not null,                            -- 必填字段使用 not null
  description text,                              -- 可选字段
  created_at timestamptz default now() not null, -- 统一使用 timestamptz
  updated_at timestamptz default now() not null
);

-- 关联表设计模板
create table related_table (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  main_table_id uuid not null references main_table(id) on delete cascade, -- 强制关联且级联删除
  ...其他字段
);

-- 创建索引
create index if not exists idx_table_user_id on table_name(user_id);
create index if not exists idx_table_foreign_key on table_name(foreign_key_id);
```

4. **RLS 策略模板**
```sql
-- 启用 RLS
alter table table_name enable row level security;

-- 删除已存在的策略
drop policy if exists "策略名称" on table_name;

-- 创建基本 CRUD 策略
create policy "Users can view their own rows"
  on table_name for select
  using (auth.uid() = user_id);

create policy "Users can insert their own rows"
  on table_name for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own rows"
  on table_name for update
  using (auth.uid() = user_id);

create policy "Users can delete their own rows"
  on table_name for delete
  using (auth.uid() = user_id);
```

## 迁移命令

1. **推送迁移**
```bash
supabase db push                # 推送新迁移
supabase db push --include-all  # 包含之前的迁移
```

2. **查看迁移状态**
```bash
supabase migration list        # 查看迁移列表
```

3. **重置迁移**
```bash
supabase migration repair --status reverted <version>  # 修复迁移历史
```

## 常见问题处理

1. **外键关系错误**
- 检查表的创建顺序
- 确保引用的表已经存在
- 使用 `cascade` 选项处理删除

2. **策略冲突**
- 使用 `drop policy if exists` 先删除已存在的策略
- 策略名称要唯一

3. **数据类型问题**
- 使用 `timestamptz` 而不是 `timestamp` 处理时区
- UUID 使用 `gen_random_uuid()` 生成
- 文本字段区分 `text` 和 `varchar`

## 最佳实践

1. **版本控制**
- 所有迁移文件都要提交到版本控制
- 不要修改已经推送的迁移文件
- 需要修改时创建新的迁移文件

2. **命名规范**
- 表名使用小写和下划线
- 索引名使用 `idx_` 前缀
- 外键名使用 `fk_` 前缀

3. **安全性**
- 始终启用 RLS
- 为每个表设置完整的 CRUD 策略
- 使用 `auth.uid()` 进行用户隔离

4. **性能优化**
- 为常用查询字段创建索引
- 使用复合索引优化多字段查询
- 避免过度索引，只索引必要的字段
