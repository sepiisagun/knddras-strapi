/**
 * request controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');
const sanitizeOutput = require('../../../utils/sanitizeOutput');
const formatMessage = require('../../../utils/formatMessage');

const moduleName = 'api::request.request';

module.exports = createCoreController(moduleName, ({ strapi }) => ({
	async create(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { data } = ctx.request.body;

		const request = await strapi.entityService.create(moduleName, {
			data: {
				date: data.date,
				slot: data.slot,
				notes: data.notes,
				status: 'PENDING',
				patient: _.get(user, 'id'),
			},
		});

		const sanitizedEntity = sanitizeOutput(request, moduleName);

		return sanitizedEntity;
	},

	async cancel(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { id } = ctx.params;

		let request = await strapi.entityService.findOne(moduleName, id, {
			populate: ['patient'],
		});

		if (_.get(request, 'patient.id') === _.get(user, 'id')) {
			request = await strapi.entityService.update(moduleName, id, {
				data: {
					status: 'CANCELLED',
				},
			});
		} else {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Request.update.cancel',
					message: 'Unable to cancel request.',
				}),
			);
		}

		const sanitizedEntity = sanitizeOutput(request, moduleName);

		return sanitizedEntity;
	},
}));
