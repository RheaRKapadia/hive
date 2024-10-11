const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './public/js/prettyavaatars.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'), // Polyfill for buffer
      // Add other polyfills here as needed
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
  devServer: {
    static: './public',    // Serve static files
    hot: true,             // Enable hot module replacement
    port: 3000,            // Use the same port as Express
    proxy: {
      '/api': 'http://localhost:3001',  // Proxy API requests to your Express app
    },
  }
  
};
