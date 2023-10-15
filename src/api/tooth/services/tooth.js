'use strict';

/**
 * tooth service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tooth.tooth');
