const path = require('path'); // Importing the 'path' module for handling file and directory paths
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // Enabling bundle analyzer based on the environment variable
});

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development', // Remove console.logs in non-development environments
  },
    experimental: {
      transpilePackages: ['react-element-popper'],
    },

  webpack: (config, { isServer }) => {
    try {
      if (!isServer) { // Check if it's the client-side code
        config.resolve.fallback = {
          ...config.resolve.fallback,
          net: false, // Excluding net module for client-side
          tls: false, // Excluding tls module for client-side
          fs: false, // Excluding fs module for client-side
          child_process: false, // Excluding child_process module for client-side
        };
      }

      config.resolve.alias = {
        ...config.resolve.alias,
        apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      };

      return config;
    } catch (error) {
      console.error('Error configuring webpack:', error);
      throw error; // Rethrow the error to prevent building in case of issues
    }
  },

  async rewrites() {
    try {
      return [
        {
          source: '/api/json',
          destination: 'https://growseb.s3.ap-south-1.amazonaws.com',
        },
        {
          source: '/api/deleteprojectseo',
          destination: 'https://sa37d33lx3.execute-api.ap-southeast-1.amazonaws.com/default/deleteprojectseo',
        },
        {
          source: '/api/posttrigger',
          destination: 'https://sa37d33lx3.execute-api.ap-southeast-1.amazonaws.com/default/posttrigger',
        },
        {
          source: '/api/Cognito',
          destination: 'https://oaxdpdgpn7.execute-api.ap-southeast-1.amazonaws.com/default/Cognito',
        },
        {
          source: '/api/seo_score',
          destination: 'https://sa37d33lx3.execute-api.ap-southeast-1.amazonaws.com/default/seo_score',
        },
        {
          source: '/api/Seo_PageAnalysis',
          destination: 'https://sa37d33lx3.execute-api.ap-southeast-1.amazonaws.com/default/Seo_PageAnalysis',
        },
        {
          source: '/api/seo_optimizer',
          destination: 'https://sa37d33lx3.execute-api.ap-southeast-1.amazonaws.com/default/seo_optimizer',
        },
        {
          source: '/api/techdashboard',
          destination: 'https://sa37d33lx3.execute-api.ap-southeast-1.amazonaws.com/default/techdashboard',
        },
        {
          source: '/api/Site_Audit',
          destination: 'https://ophre6symy367n5vf4fvyd5z6a0hrurd.lambda-url.ap-southeast-1.on.aws/',
        },
      ];
    } catch (error) {
      console.error('Error setting up rewrites:', error);
      return []; // Return an empty array to handle the error gracefully
    }
  },
};

module.exports = withBundleAnalyzer(nextConfig);
