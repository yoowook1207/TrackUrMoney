const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const webpack = require("webpack");
const WebpackPwaManifest = require("webpack-pwa-manifest");

const config = {
    entry: {
      app: "./public/js/index.js"
    },
    output: {
      filename: "[name].bundle.js",
      path: `${__dirname}/dist`
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                esModule: false,
                name (file) {
                  return "[path][name].[ext]"
                },
                publicPath(url) {
                  return url.replace("../", "/assets/")
                }
              }  
            },
            {
              loader: 'image-webpack-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new WebpackPwaManifest({
        name: "Track Ur Money",
        short_name: "TUM",
        description: "An app that allows you to track money budgets.",
        start_url: "./public/index.html",
        background_color: "#01579b",
        theme_color: "#ffffff",
        fingerprints: false,
        inject: false,
        icons: [{
          src: path.resolve("public/icons/icon-512x512.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("assets", "icons")
        }]
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static", // the report outputs to an HTML file in the dist folder
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, '/'),
      }
    },
    mode: 'development'
};

module.exports = config;
