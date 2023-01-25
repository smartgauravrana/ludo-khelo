const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  const { NODE_ENV } = env;
  const config = {
    mode: NODE_ENV,
    entry: "./src/index.jsx",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name].[contenthash].js",
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    // devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"], // "eslint-loader"
        },
        {
          test: /\.s?css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  includePaths: ["./src"],
                },
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|ttf|eot|otf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "fonts/[name]-[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "img/[name]-[contenthash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(mp4)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "video/[name]-[contenthash].[ext]",
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          BUILD_ENV: JSON.stringify(NODE_ENV),
        },
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new MomentLocalesPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[name].[contenthash].css",
        ignoreOrder: true,
      }),
    ],
    devServer: {
      // index: "index.html",
      hot: "only",

      historyApiFallback: {
        rewrites: [
          {
            from: "",
            to: "/index.html",
          },
        ],
      },
      proxy: {
        "/api": {
          target: "http://localhost:3000",
        },
      },
      port: 8080,
    },
  };

  if (NODE_ENV === "development") {
    config.devtool = "inline-source-map";
  }

  if (NODE_ENV === "production") {
    config.plugins.push(
      ...[
        new CompressionPlugin({
          // filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        }),
        new BrotliPlugin({
          // asset: "[path].br[query]",
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        }),
      ]
    );
  }

  return config;
};
