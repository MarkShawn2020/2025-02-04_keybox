# NPM 发布指南

## 包名策略

### Scoped Package (@organization/package-name)
1. **优势**
   - 更好的命名空间管理
   - 更容易管理包的权限和协作
   - 适合团队/组织级别的包

2. **前置条件**
   - 需要先在 npm 创建对应的 organization
   - 可以通过 https://www.npmjs.com/org/create 创建
   - 或使用个人 scope（例如 @username/package-name）

3. **发布命令**
```bash
npm publish --access public
```

### Non-scoped Package (package-name)
1. **优势**
   - 更简单的发布流程
   - 无需预先创建 organization
   - 更容易被用户发现

2. **注意事项**
   - 需要确保包名全局唯一
   - 可以通过 `npm view package-name` 检查包名是否可用

3. **发布命令**
```bash
npm publish --access public
```

## 发布检查清单

1. **准备工作**
   - 确保已登录 npm：`npm whoami`
   - 如未登录，运行：`npm login`

2. **构建检查**
   - 运行构建：`pnpm build`
   - 确保 dist 文件已生成

3. **package.json 配置**
   - name: 包名（scoped 或 non-scoped）
   - version: 遵循语义化版本
   - main: 入口文件
   - bin: CLI 工具的可执行文件
   - dependencies/devDependencies: 依赖配置

4. **发布后检查**
   - 运行 `npm pkg fix` 修复潜在问题
   - 验证包是否可以全局安装：`npm install -g package-name`
   - 检查 README.md 是否正确显示在 npm 页面

## 最佳实践

1. **版本管理**
   - 遵循语义化版本（Semantic Versioning）
   - major.minor.patch 格式
   - 重大更新增加 major 版本
   - 新功能增加 minor 版本
   - bug 修复增加 patch 版本

2. **文档维护**
   - README.md 包含安装和使用说明
   - 清晰的更新日志（CHANGELOG.md）
   - 详细的 API 文档

3. **质量保证**
   - 发布前完整测试
   - 确保所有必要文件都包含在发布包中
   - 验证在不同环境下的安装和使用
