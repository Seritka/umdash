module.exports = {
  extends: [
    'plugin:@next/next/recommended'
  ],
  experimental: {
    concurrentFeatures: true,
    serverComponents: true
  },
  swcMinify: true
}
