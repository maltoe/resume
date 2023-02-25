const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',

  entry: './src/index.js',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /crypt/,
        use: [{
          loader: path.resolve(__dirname, 'loaders/secrets-loader.js'),
          options: { secretsPath: path.resolve(__dirname, 'secrets.crypt.json') }
        }],
        type: 'asset/source'
      },
      {
        test: /\.svg/,
        type: 'asset/inline'
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/static' }]
    })
  ]
};
