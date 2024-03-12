import webpack from "webpack";
import request from "request";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const bundleFile = "app-bundle.js";
const bundlePath = path.join(__dirname, bundleFile);

const config: webpack.Configuration = {
  entry: "./src/server/app.ts",
  output: {
    filename: bundleFile,
    path: __dirname,
    libraryTarget: "var",
    library: "app",
  },
  resolve: {
    extensions: [".ts", ".js", ".mjs"],
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            onlyCompileBundledFiles: true,
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
    ],
  },
};

webpack(config, (err, stats) => {
  if (err || stats?.hasErrors()) {
    console.error(err);
    console.log(stats?.toString());
    return;
  }
  // Done processing
  console.log("Compilation completed! Updating app server...");

  const app = fs.readFileSync(bundlePath, "utf8") + "app";
  const key = process.env.INFRA_KEY;

  request.post(
    "http://localhost:3012/update-app",
    { json: { app, key } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      } else {
        console.error("Error updating app server: ", error, body);
      }
      fs.unlinkSync(bundlePath);
    }
  );
});
