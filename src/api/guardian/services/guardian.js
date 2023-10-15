'use strict';

/**
 * guardian service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::guardian.guardian');
