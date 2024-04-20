/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, {isServer }) {
        console.log('Creating Webpack config:', {isServer, target: config.target});

        if (config.target[0] === "web") {
            console.log('Setting aliasFields to ["browser"] for web target.');
            config.resolve.aliasFields = ["browser"];
        }

        return config;
    },
};

export default nextConfig;
