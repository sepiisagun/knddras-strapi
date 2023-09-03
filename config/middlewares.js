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
            'dl.airtable.com',
            `https://${env("AWS_BUCKET")}.s3.amazonaws.com`,
            'market-assets.strapi.io',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            `https://${env("AWS_BUCKET")}.s3.amazonaws.com`,
            'market-assets.strapi.io',
          ],
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
	  name: 'strapi::cors',
      config: {
        enabled: true,
        headers: '*',
        origin: '*',
      },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
