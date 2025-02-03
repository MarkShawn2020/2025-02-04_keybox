# EnvBox - 环境变量管理系统 PRD

## 1. 产品概述

EnvBox 是一个现代化的环境变量管理系统，旨在帮助开发团队安全、高效地管理和共享环境变量。

### 1.1 产品定位

- **目标用户**：开发团队、DevOps 工程师、系统管理员
- **核心价值**：简化环境变量管理流程，提高团队协作效率，确保安全性
- **使用场景**：项目部署、团队协作、配置管理

### 1.2 技术栈

- **前端**：
  - Next.js 14
  - React 18
  - TailwindCSS
  - next-themes（暗色模式）
  - TypeScript

- **后端**：
  - Express.js
  - TypeScript
  - Supabase（认证和数据库）

## 2. 功能规格

### 2.1 用户认证

- [x] Supabase Auth 集成
- [x] 用户注册/登录
- [x] 会话管理
- [ ] 社交账号登录（待开发）
- [ ] 双因素认证（待开发）

### 2.2 环境变量管理

- [x] 创建和存储环境变量
- [x] 变量分组（Solutions）
- [x] 变量版本控制
- [x] 变量加密存储
- [ ] 变量导入/导出（待开发）
- [ ] 变量模板（待开发）

### 2.3 访问控制

- [x] 基于角色的访问控制（RBAC）
- [x] 行级安全策略（RLS）
- [ ] 团队和组织管理（待开发）
- [ ] 细粒度权限控制（待开发）

### 2.4 集成功能

- [ ] CI/CD 集成（待开发）
- [ ] API 接口（待开发）
- [ ] Webhook 支持（待开发）
- [ ] 第三方服务集成（待开发）

## 3. 技术架构

### 3.1 数据模型

#### Users
- id: uuid (主键)
- email: string
- created_at: timestamp
- last_sign_in: timestamp

#### Keys
- id: uuid (主键)
- user_id: uuid (外键 -> users.id)
- name: string
- value: string (加密存储)
- description: string
- tags: string[]
- revoked: boolean
- created_at: timestamp
- updated_at: timestamp

#### Solutions
- id: uuid (主键)
- user_id: uuid (外键 -> users.id)
- name: string
- description: string
- created_at: timestamp
- updated_at: timestamp

#### Solution_Keys
- solution_id: uuid (外键 -> solutions.id)
- key_id: uuid (外键 -> keys.id)
- created_at: timestamp

### 3.2 安全设计

1. **数据加密**
   - 环境变量值使用强加密算法存储
   - 传输过程使用 HTTPS 加密

2. **访问控制**
   - 使用 Supabase RLS 策略
   - 每个用户只能访问自己的数据
   - API 请求需要有效的 JWT token

3. **审计日志**
   - 记录所有关键操作
   - 包含时间戳和操作者信息

## 4. 用户界面

### 4.1 布局设计

- 响应式设计，支持移动端和桌面端
- 支持亮色/暗色主题
- 清晰的导航结构
- 直观的操作界面

### 4.2 主要页面

1. **仪表盘**
   - 环境变量概览
   - 最近活动
   - 快速操作

2. **变量管理**
   - 变量列表
   - 创建/编辑变量
   - 变量详情

3. **方案管理**
   - 方案列表
   - 创建/编辑方案
   - 变量分组

4. **设置**
   - 用户设置
   - 安全设置
   - 团队管理

## 5. API 设计

### 5.1 认证 API

```typescript
POST /auth/login
POST /auth/register
POST /auth/logout
GET /auth/session
```

### 5.2 环境变量 API

```typescript
GET /keys
POST /keys
GET /keys/:id
PUT /keys/:id
DELETE /keys/:id
POST /keys/:id/revoke
```

### 5.3 方案 API

```typescript
GET /solutions
POST /solutions
GET /solutions/:id
PUT /solutions/:id
DELETE /solutions/:id
GET /solutions/:id/env
```

## 6. 部署架构

### 6.1 开发环境

- 本地开发服务器
- Supabase 本地开发实例
- 环境变量配置

### 6.2 生产环境

- 前端：Vercel
- 后端：独立服务器
- 数据库：Supabase
- 监控和日志

## 7. 后续规划

### 7.1 近期计划

1. 完善基础功能
   - [ ] 完善错误处理
   - [ ] 添加加载状态
   - [ ] 优化用户体验

2. 增加核心特性
   - [ ] 变量历史记录
   - [ ] 批量操作
   - [ ] 搜索和过滤

### 7.2 长期规划

1. 企业级功能
   - [ ] SSO 集成
   - [ ] 审计日志
   - [ ] 合规报告

2. 生态系统
   - [ ] CLI 工具
   - [ ] SDK 支持
   - [ ] 插件系统

## 8. 参考资料

- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Express.js 文档](https://expressjs.com/)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
