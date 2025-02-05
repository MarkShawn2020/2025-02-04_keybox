#!/bin/bash

# 确保 dist 目录存在
mkdir -p dist

# 编译 TypeScript
pnpm build

# 确保入口文件有执行权限
chmod +x dist/index.js

# 创建全局链接
pnpm link --global
