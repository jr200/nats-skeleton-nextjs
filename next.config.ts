import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'
import withPlugins from 'next-compose-plugins'
import { DEFAULT_HOMEPAGE_URL } from '@/constants'
import { webpack } from 'next/dist/compiled/webpack/webpack'
import { name, version } from './package.json'

const nextConfig: NextConfig = withPlugins([[withBundleAnalyzer({ enabled: false })]], {
  env: {
    packageName: name,
    packageVersion: version,
  },
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  experimental: {
    // reactCompiler: {
    //   compilationMode: "annotation",
    // },
  },
  async rewrites() {
    return [
      { source: '/', destination: DEFAULT_HOMEPAGE_URL },
      { source: '/healthz', destination: '/api/health' },
    ]
  },
  output: 'standalone',
  webpack: (config: webpack.Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          // fixes @nats-io/transport-node dependencies
          net: false,
          dns: false,
          tls: false,
          fs: false,
          // assert: false,
          // path: false,
          // events: false,
          // process: false,
        },
      } as webpack.ResolveOptions
    }
    config.plugins?.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource: any) => {
        resource.request = resource.request.replace(/^node:/, '')
      })
    )
    return config
  },
})

export default nextConfig
