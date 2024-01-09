/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            net: false,

            dns: false,
            tls: false,
            assert: false,
            // fixes next-i18next dependencies
            path: false,
            fs: false,
            // fixes mapbox dependencies
            events: false,
            // fixes sentry dependencies
            process: false,
        };
        return config;
    },
};

module.exports = nextConfig;
