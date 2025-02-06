# KeyBox：一种优雅的环境变量管理系统，让环境变量不再烦恼~

> “第七个产品了，这次我要解决一个困扰我很久的问题 —— 环境变量管理。”

作为一名独立开发者，我计划在 2025 年开发 50 个产品。而 KeyBox 是我今年的第七个作品，也是一个我很看重的项目。因为它不仅优雅地解决了环境变量管理的痛点，而且我自己也会重度使用它。我相信它同样能帮助其他开发者更轻松地管理他们的环境变量。

![image.png](https://poketto.oss-cn-hangzhou.aliyuncs.com/202502052213801.png?x-oss-process=image/resize,w_800)


```insta-toc
---
title:
  name: 全文目录：
  level: 1
  center: false
exclude: ""
style:
  listType: dash
omit: []
levels:
  min: 1
  max: 6
---

# 全文目录：

- KeyBox：一种优雅的环境变量管理系统，让环境变量不再烦恼
    - 01. 🤔 你是否也遇到过这些烦恼？
    - 02. 💡 认识 KeyBox：优雅的环境变量管理方案
    - 03. 🚀 快速上手
    - 04. 💻 功能演示
        - 📁 环境变量管理面板
        - 📚 项目管理面板
        - ⚙️ 设置面板
        - 💻 命令行登录
        - 💾 命令行拉取
    - 05. 💳 产品定价
    - 06. 💪 为什么选择 KeyBox？
    - 07. 🔗 开源与私有化
    - 08. (OO)? 当前的一些问题
    - 09. 💙 开发者的话
```

## **01. 🤔** 你是否也遇到过这些烦恼？  

- 前端、后端环境变量要分开配置，一个项目要维护多个 `.env` 文件
- 本地开发、生产环境的配置文件互不相同，经常配错环境
- Nextjs 要求 `NEXT_PUBLIC_`，Vite 要求 `VITE_`，各种框架前缀让人头大
- 重要的 API Key 只能生成一次，复制到 `.env` 后被 git ignore，之后再也找不到了
- 团队协作时，新成员配置环境总是出问题，每次都要手把手教学

## **02. 💡** 认识 KeyBox：优雅的环境变量管理方案

KeyBox 是一个中心化的环境变量管理系统，它能让你：

1. **一处配置，多处使用**
   - 在统一的 Web 界面管理所有项目的环境变量
   - 支持多环境（开发、测试、生产）配置
   - 自动处理不同框架的变量前缀

2. **安全可靠**
   - 采用 PKCE 认证流程，CLI 登录更安全
   - 企业级加密存储，保护你的敏感信息
   - 完善的用户协议和隐私政策保障

3. **开发体验**
   - 简单的 CLI 工具，一键拉取配置
   - 自动生成项目所需的 `.env` 文件
   - 支持私有化部署，掌控数据安全

## **03. 🚀** 快速上手

1. 访问 [https://keybox.cs-magic.cn](https://keybox.cs-magic.cn)
2. 使用命令行工具登录（支持 PKCE 安全认证）
3. 配置你的项目和环境变量
4. 一键导出或拉取配置

## **04. 💻** 功能演示

### 📁 环境变量管理面板

![image.png](https://poketto.oss-cn-hangzhou.aliyuncs.com/202502052152834.png?x-oss-process=image/resize,w_800)

- 直观的变量列表
- 快捷编辑与复制
- 安全的加密存储

### 📚 项目管理面板

![image.png](https://poketto.oss-cn-hangzhou.aliyuncs.com/202502052156076.png?x-oss-process=image/resize,w_800)

- 项目分组与组织
- 环境变量模板
- 权限管理

### ⚙️ 设置面板

![image.png](https://poketto.oss-cn-hangzhou.aliyuncs.com/202502052156765.png?x-oss-process=image/resize,w_800)

- 个人偏好设置
- 安全与集成
- 通知管理

### 💻 命令行登录

![image.png](https://poketto.oss-cn-hangzhou.aliyuncs.com/202502052157214.png?x-oss-process=image/resize,w_800)

```zsh
025/02/05 21:48:40 ➜  2025-02-04_keybox git:(monorepo) ✗ keybox login
🔑 Checking for existing credentials...
ℹ No existing login found
Connecting to API server...

To login, please enter this code on the verification page:

    4B0D3461

Opening browser to http://localhost:3000/verify-device...
✓ Successfully logged in!
2025/02/05 21:57:22 ➜  2025-02-04_keybox git:(monorepo) ✗ keybox login
🔑 Checking for existing credentials...
✓ Found existing token
🔍 Checking current login status...
✓ Successfully retrieved user info

✓ Successfully verified existing login!
Username: shawninjuly@gmail.com
Last login: 2/5/2025, 9:51:33 PM
20
```

### 💾 命令行拉取

命令行登录后会持久化账号，接着就可以直接基于项目的 `.env.example` 之类的文件自动创建项目所需要的初始环境变量配置，也可以拉取目标项目的配置到本地的 `.env`，并且支持自动化地基于项目框架添加合适的前缀等。

```zsh
2025/02/05 21:57:33 ➜  2025-02-04_keybox git:(monorepo) ✗ keybox create
Using current directory name as project: 2025-02-04_keybox
Creating project 2025-02-04_keybox with 2 environment variables...
✓ Project created and environment variables saved to .env
2025/02/05 21:58:04 ➜  2025-02-04_keybox git:(monorepo) ✗ keybox pull -p 2025-02-04_keybox
Pulling environment variables for project: 2025-02-04_keybox
✓ Environment variables saved to .env
```

## **05. 💳** 产品定价

**限时免费体验中！**

为了让更多开发者体验到 KeyBox 带来的便利，目前产品处于免费使用期。但由于我们需要承担：

- 数据存储和服务器成本
- 用户数据安全保障
- 产品维护和更新

未来可能会推出合理的收费模式。建议大家把握当前的免费使用机会！

## **06. 💪** 为什么选择 KeyBox？

1. **专注解决痛点**：针对环境变量管理的实际问题设计
2. **安全可靠**：采用业界最佳实践，保护数据安全
3. **开发者友好**：简单易用，提升开发效率
4. **持续维护**：活跃的更新和社区支持

## **07. 🔗** 开源与私有化

担心数据安全？没问题！KeyBox 完全开源：
[https://github.com/MarkShawn2020/2025-02-04_keybox](https://github.com/MarkShawn2020/2025-02-04_keybox)

你可以：
- 审查源码
- 私有化部署
- 自定义功能
- 贡献代码

你也可以直接在网站 keybox.cs-magic.cn 右上方点击 Deploy 按钮一键部署！

![image.png](https://poketto.oss-cn-hangzhou.aliyuncs.com/202502061637966.png?x-oss-process=image/resize,w_800)

## **08. (O_O)?** 当前的一些问题

- 目前采用的是海外的 supabase，但网站是在国内，然后在 UI 上使用了悲观更新，所以体验有点慢，未来会优化这个架构
- 目前基于 supabase + loops，实现了邮件登录，体验还不错，但用户量有点限制（对于我们来说暂时可以了）
- 项目管理 + cli 部分还没有完全做完，将持续更新

## **09. 💙** 开发者的话

作为 KeyBox 的开发者，我想说：

> 这不仅是一个产品，更是我自己的必需。我正在把我所有的环境变量都迁移到 KeyBox 上，因为我相信这是目前最优雅的解决方案。

---
*KeyBox - 从此让环境变量管理不再烦恼~*
