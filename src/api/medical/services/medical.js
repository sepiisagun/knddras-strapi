'use strict';

/**
 * medical service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::medical.medical');
