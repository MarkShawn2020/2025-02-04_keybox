const { codeInspectorPlugin } = require('code-inspector-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    // Add code-inspector-plugin
    if (dev) {
      config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }))
    }

    return config
  },
}

module.exports = nextConfig
