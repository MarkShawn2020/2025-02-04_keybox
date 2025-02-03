# Next.js 中 SVG 导入问题排查

## 问题描述

在 Next.js 项目中，当直接导入 SVG 文件作为 React 组件使用时，可能会遇到以下错误：

```
Error: Objects are not valid as a React child (found: object with keys {$$typeof, type, key, ref, props})
```

## 原因分析

这个问题与 Next.js 版本有关。在 Next.js 14 及以下版本中，即使配置了正确的 SVG 处理（包括 @svgr/webpack 配置和正确的类型定义），也可能会出现这个问题。

## 解决方案

### 方案一：升级 Next.js（推荐）

将 Next.js 升级到 15 或更高版本：

```json
{
  "dependencies": {
    "next": "latest"
  }
}
```

### 方案二：保持现有配置

如果必须使用 Next.js 14 或更低版本，确保以下配置正确：

1. **next.config.js**:
```js
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  }
};

module.exports = nextConfig;
```

2. **types/svg.d.ts**:
```ts
declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react'
  const content: FunctionComponent<SVGProps<SVGSVGElement>>
  export default content
}
```

3. **安装必要的依赖**:
```bash
pnpm add -D @svgr/webpack
```

## 最佳实践

1. **新项目**：
   - 直接使用 Next.js 15+ 版本
   - 遵循官方文档的 SVG 配置指南

2. **现有项目**：
   - 如果可以升级，建议升级到 Next.js 15+
   - 如果不能升级，可以考虑以下替代方案：
     - 将 SVG 转换为 React 组件
     - 使用 `next/image` 处理 SVG
     - 使用其他 SVG 处理库

## 相关链接

- [Next.js 官方文档](https://nextjs.org/docs)
- [@svgr/webpack 文档](https://react-svgr.com/docs/webpack/)
