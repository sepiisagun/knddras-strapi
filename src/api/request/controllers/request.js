/**
 * request controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { DateTime } = require('luxon');
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

	async accept(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { id } = ctx.params;
		const { role } = user;
		const { data } = ctx.request.body;

		let request = await strapi.entityService.findOne(moduleName, id, {
			populate: ['patient'],
		});

		if (role.type === 'dental_assistant') {
			request = await strapi.entityService.update(moduleName, id, {
				data: {
					status: 'ACCEPTED',
				},
			});
			const date = DateTime.fromISO(data.date).toFormat('yyyy-MM-dd');
			const time = DateTime.fromISO(data.date).toFormat('HH:mm:ss');

			await strapi.entityService.create('api::appointment.appointment', {
				data: {
					date,
					time,
					purpose: data.purpose,
					patient: data.patient,
					doctor: data.doctor,
					request: request.id,
				},
			});

			// email
		} else {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Request.update.accept',
					message: 'Permission Denied.',
				}),
			);
		}

		const sanitizedEntity = sanitizeOutput(request, moduleName);

		return sanitizedEntity;
	},

	async reject(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { id } = ctx.params;
		const { role } = user;
		const { data } = ctx.request.body;

		let request = await strapi.entityService.findOne(moduleName, id, {
			populate: ['patient'],
		});

		if (role.type === 'dental_assistant') {
			request = await strapi.entityService.update(moduleName, id, {
				data: {
					reason: data.reason,
					status: 'REJECTED',
				},
			});
		} else {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Request.update.reject',
					message: 'Permission Denied.',
				}),
			);
		}

		const sanitizedEntity = sanitizeOutput(request, moduleName);

		return sanitizedEntity;
	},
}));
