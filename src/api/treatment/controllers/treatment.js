/**
 * treatment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');
const sanitizeOutput = require('../../../utils/sanitizeOutput');

const moduleName = 'api::treatment.treatment';
module.exports = createCoreController(moduleName, ({ strapi }) => ({
	async userTransactions(ctx) {
		const { filters, paginate, sort = [] } = ctx.request.query;
		const { patient } = filters;
		const { id: userId } = patient;

		const [record] = await strapi.entityService.findMany('api::record.record', {
			filters: {
				patient: userId,
			},
		});

		const treatments = await strapi.entityService.findMany(moduleName, {
			filters: {
				record: _.get(record, 'id'),
			},
			paginate: {
				...paginate,
			},
			populate: ['procedure'],
			sort: [...sort],
		});

		const sanitizedEntity = await sanitizeOutput(treatments, moduleName);

		return sanitizedEntity;
	},
}));
