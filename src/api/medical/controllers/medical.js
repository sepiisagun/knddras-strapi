/**
 * medical controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');
const sanitizeOutput = require('../../../utils/sanitizeOutput');

const moduleName = 'api::medical.medical';

// eslint-disable-next-line no-unused-vars
module.exports = createCoreController(moduleName, ({ strapi }) => ({
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

	async findOne(ctx) {
		const { id } = ctx.params;

		const [record] = await strapi.entityService.findMany('api::record.record', {
			filters: {
				patient: {
					id,
				},
			},
			populate: ['*'],
		});

		const [medical] = await strapi.entityService.findMany(moduleName, {
			filters: {
				record: {
					id: record.id,
				},
			},
		});

		const sanitizedEntity = await sanitizeOutput(medical, moduleName);

		return sanitizedEntity;
	},

	async update(ctx) {
		const { id } = ctx.params;
		const { data } = ctx.request.body;

		const medical = await strapi.entityService.update(moduleName, id, {
			data: {
				...data,
			},
		});

		const sanitizedEntity = await sanitizeOutput(medical, moduleName);

		return sanitizedEntity;
	},
}));
