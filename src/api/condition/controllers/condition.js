/**
 * condition controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');
const sanitizeOutput = require('../../../utils/sanitizeOutput');

const moduleName = 'api::condition.condition'; 

module.exports = createCoreController(moduleName, ({ strapi }) => ({
    async findSelf(ctx) {
        const { state } = ctx;
        const { user } = state;
        const { id } = user;

		const [record] = await strapi.entityService.findMany('api::record.record', {
			filters: {
				patient: {
					id,
				},
			},
			populate: ['*'],
		});

		const [condition] = await strapi.entityService.findMany(moduleName, {
			filters: {
				record: {
					id: record.id,
				},
			},
		});

		const sanitizedEntity = await sanitizeOutput(condition, moduleName);

		return sanitizedEntity;
    },

    async create(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { data } = ctx.request.body;

		const [record] = await strapi.entityService.findMany('api::record.record', {
			filters: {
				patient: {
					id: _.get(user, 'id'),
				},
			},
			populate: ['*'],
		});

		const medical = await strapi.entityService.create(moduleName, {
			data: {
				...data,
				record: _.get(record, 'id'),
			},
		});

		const sanitizedEntity = await sanitizeOutput(medical, moduleName);

		return sanitizedEntity;
	},
}));
