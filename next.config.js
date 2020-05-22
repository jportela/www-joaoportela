const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'blog/**/*.png'),
              to: path.join(__dirname, 'public/assets')
            }
          ]
        })
      );
    }
    return config
  }
})