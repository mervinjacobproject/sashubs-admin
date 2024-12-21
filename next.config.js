// const path = require('path') // Importing the 'path' module for handling file and directory paths
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true' // Enabling bundle analyzer based on the environment variable
// })

// const nextConfig = {
//   reactStrictMode: true,
//   trailingSlash: true,

//   compiler: {
//     removeConsole: process.env.NODE_ENV !== 'development' // Remove console.logs in non-development environments
//   },
//   experimental: {
//     transpilePackages: ['react-element-popper']
//   },

//   webpack: (config, { isServer }) => {
//     try {
//       if (!isServer) {
//         // Check if it's the client-side code
//         config.resolve.fallback = {
//           ...config.resolve.fallback,
//           net: false, // Excluding net module for client-side
//           tls: false, // Excluding tls module for client-side
//           fs: false, // Excluding fs module for client-side
//           child_process: false // Excluding child_process module for client-side
//         }
//       }

//       config.resolve.alias = {
//         ...config.resolve.alias,
//         apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
//       }

//       return config
//     } catch (error) {
//       console.error('Error configuring webpack:', error)
//       throw error // Rethrow the error to prevent building in case of issues
//     }
//   }
// }

// module.exports = withBundleAnalyzer(nextConfig)

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
