let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "react-native-sqlite-storage": "commonjs react-native-sqlite-storage",
        "@sap/hana-client/extension/Stream": "commonjs @sap/hana-client/extension/Stream",
        "mysql": "commonjs mysql2",
         "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil"
      });
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/typeorm/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
            plugins: ["@babel/plugin-transform-modules-commonjs"],
          },
        },
      });

      config.ignoreWarnings = [
        {
          module: /typeorm/,
          message: /Critical dependency: the request of a dependency is an expression/,
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
