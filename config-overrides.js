module.exports = function override(config, env) {
  console.log("override");
  let resolve = config.resolve;
  resolve.fallback = {
    fs: require.resolve("browserify-fs"),
    path: require.resolve("path-browserify"),
    buffer: require.resolve("buffer-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert-browserify"),
  };

  return config;
};
