const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // The App Router is stable, but the Vanilla Extract Next Plugin
    // currently requires that `experimental.appDir` is `true`.
    //
    // https://github.com/vanilla-extract-css/vanilla-extract/issues/929#issuecomment-1538555608
    appDir: true,
  },
}

module.exports = withVanillaExtract(nextConfig)
