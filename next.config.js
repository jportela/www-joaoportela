const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

const config = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'blog/**/*.(png|jpeg)'),
              to: path.join(__dirname, 'public/assets'),
            },
          ],
        }),
      )
    }
    return config
  },
}

module.exports = withBundleAnalyzer(withMDX(config))
