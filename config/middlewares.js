module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'cdn.jsdelivr.net',
            'dl.airtable.com',
            `${env("AWS_BUCKET")}.s3.${env("AWS_REGION")}.amazonaws.com`,
            'strapi.io',
            'market-assets.strapi.io',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'cdn.jsdelivr.net',
            'dl.airtable.com',
            `${env("AWS_BUCKET")}.s3.${env("AWS_REGION")}.amazonaws.com`,
            'strapi.io',
            'market-assets.strapi.io',
          ],
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
