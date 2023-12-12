/**
 * appointment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { DateTime } = require('luxon');
const formatMessage = require('../../../utils/formatMessage');
const sanitizeOutput = require('../../../utils/sanitizeOutput');

const moduleName = 'api::appointment.appointment';

module.exports = createCoreController(moduleName, ({ strapi }) => ({
	async create(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { role } = user;
		const { data } = ctx.request.body;

		let appointment;

		if (role.type === 'dental_assistant') {
			const date = DateTime.fromISO(data.date).toFormat('yyyy-MM-dd');
			const time = DateTime.fromISO(data.date).toFormat('HH:mm:ss');
			console.log(time);

			appointment = await strapi.entityService.create('api::appointment.appointment', {
				data: {
					date,
					time,
					purpose: data.purpose,
					patient: data.patient,
					doctor: data.doctor,
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

		const sanitizedEntity = sanitizeOutput(appointment, moduleName);

		return sanitizedEntity;
	},
}));
