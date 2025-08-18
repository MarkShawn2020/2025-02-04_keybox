# Code Inspector Development Setup

This document describes how to develop and test new features for `code-inspector-plugin` using the keybox project.

## Setup Overview

We use a local file link to develop code-inspector features while testing them in the keybox project.

## Configuration

### 1. Package.json Configuration

In `/Users/mark/projects/keybox/packages/web/package.json`:
```json
{
  "dependencies": {
    "code-inspector-plugin": "file:../../../../repos/code-inspector/packages/code-inspector-plugin"
  }
}
```

### 2. Root Package.json Overrides

In `/Users/mark/projects/keybox/package.json`, we need to override workspace dependencies:
```json
{
  "pnpm": {
    "overrides": {
      "code-inspector-core": "file:../../repos/code-inspector/packages/core",
      "vite-code-inspector-plugin": "file:../../repos/code-inspector/packages/vite-plugin",
      "webpack-code-inspector-plugin": "file:../../repos/code-inspector/packages/webpack-plugin",
      "esbuild-code-inspector-plugin": "file:../../repos/code-inspector/packages/esbuild-plugin",
      "turbopack-code-inspector-plugin": "file:../../repos/code-inspector/packages/turbopack-plugin"
    }
  }
}
```

These overrides are necessary because code-inspector-plugin uses workspace dependencies that need to be resolved locally.

## Development Workflow

### 1. Make Changes in Code Inspector

Navigate to `/Users/mark/repos/code-inspector` and make your changes.

### 2. Build the Changes

```bash
cd /Users/mark/repos/code-inspector
pnpm build
```

### 3. Update Dependencies in Keybox

```bash
cd /Users/mark/projects/keybox
pnpm install
```

This will update the linked packages with your latest changes.

### 4. Test in Browser

1. Start the development server:
   ```bash
   cd /Users/mark/projects/keybox/packages/web
   pnpm dev
   ```

2. Open http://localhost:3000 (or the port shown in terminal)

3. Open the browser console (F12 or Cmd+Option+I)

4. You should see the message:
   ```
   [code-inspector-plugin] Press and hold shift + ⌥option to enable the feature. (click on page elements to locate the source code in the editor)
   ```

5. Hold Shift + Option (on Mac) or Shift + Alt (on Windows) and hover over elements to see the inspector overlay

## Important Notes

- **file: protocol vs pnpm link**: We use `file:` protocol in package.json instead of `pnpm link` because:
  - `pnpm link` creates temporary symlinks that are reset when running `pnpm install`
  - `file:` protocol creates persistent links that survive `pnpm install`

- **Rebuilding**: Always rebuild code-inspector after making changes:
  ```bash
  cd /Users/mark/repos/code-inspector && pnpm build
  ```

- **Cache Issues**: If changes don't appear, try:
  1. Clear Next.js cache: `rm -rf packages/web/.next`
  2. Reinstall dependencies: `pnpm install --force`

## Publishing Your Version

When your feature is ready, you can publish to npm under your namespace:

### Option 1: Scoped Package
```bash
# In code-inspector-plugin/package.json, change name to:
"name": "@cs-magic/code-inspector-plugin"

# Then publish:
cd packages/code-inspector-plugin
npm publish --access public
```

### Option 2: Use Existing Package
You already own `code-inspector-plugin-x` on npm, which you can use for publishing.

## Creating a Pull Request

Once tested, create a PR to the original repository:

```bash
cd /Users/mark/repos/code-inspector
git add .
git commit -m "feat: your feature description"
git push origin your-branch
gh pr create --base zh-lx:main
```

## Troubleshooting

### Plugin Not Loading
- Check the browser console for errors
- Verify next.config.js has the plugin configured
- Ensure the plugin is only loaded in dev mode

### Changes Not Reflecting
- Rebuild code-inspector: `pnpm build`
- Clear Next.js cache
- Restart the dev server

### Console Message Not Appearing
- Check if `hideConsole` option is set in plugin configuration
- Verify the browser console filter isn't hiding info messages