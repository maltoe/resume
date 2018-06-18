const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',

  entry: './src/resume.js',

  output: {
    filename: 'resume.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new CopyWebpackPlugin([{ from: 'src/static' }])
  ],

  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },

  /*
  resolveLoader: {
    fallback: [
      path.resolve(__dirname, 'loaders'),
      path.join(process.cwd(), 'node_modules')
    ]
  },
  */

  module: {
    rules: [
      {
        test: /secrets\.dat$/,
        use: ["json-loader", "secrets-loader"]
      },

      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader",
          options: {
            data: '@import "variables";',
            includePaths: [path.join(__dirname, 'src/css')]
          }
        }]
      },

      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },

      {
        test: /\.(png|jpg)$/,
        use: ["file-loader"]
      }
    ]
  }
};
