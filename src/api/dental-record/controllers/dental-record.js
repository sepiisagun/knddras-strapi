/**
 * dental-record controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const formatMessage = require('../../../utils/formatMessage');
const sanitizeOutput = require('../../../utils/sanitizeOutput');

const moduleName = 'api::dental-record.dental-record';
const chartModuleName = 'api::dental-chart.dental-chart';
module.exports = createCoreController(moduleName, ({ strapi}) => ({
    async create(ctx) {
        const { state } = ctx;
		const { user } = state;
		const { role } = user;
		const { data } = ctx.request.body;

        if (role.type !== ("dentist" || "associate_dentist")) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Dental-Record.create.forbidden',
					message: 'Permission Denied.',
				}),
			);
		}

        const dentalRecord = await strapi.entityService.create(moduleName, {
            data: {
                ...data.dentalRecord,
                record: data.record,
            },
        });

        const dentalChart = await strapi.entityService.create(chartModuleName, {
            data: {
                dentalCondition: data.dentalCondition,
                dental_record: dentalRecord.id,
            },
        });
        
        const sanitizedRecord = sanitizeOutput(dentalRecord, moduleName);

        const sanitizedChart = sanitizeOutput(dentalChart, chartModuleName);

        const res = {
            dentalChart: {
                ...sanitizedChart,
            },
            dentalRecord: {
                ...sanitizedRecord,
            },
        };
        
		return res;
    },

    async update(ctx) {
        const { state } = ctx;
		const { user } = state;
		const { role } = user;
		const { data } = ctx.request.body;
        const { id } = ctx.params;

        if (role.type !== ("dentist" || "associate_dentist")) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Dental-Record.update.forbidden',
					message: 'Permission Denied.',
				}),
			);
		}
        
        const dentalRecord = await strapi.entityService.update(moduleName, id, {
            data: {
                ...data.dentalRecord,
            },
        });

        const dentalChart = await strapi.entityService.update(chartModuleName, data.dentalChart, {
            data: {
                dentalCondition: data.dentalCondition,
            },
        });
        
        const sanitizedRecord = sanitizeOutput(dentalRecord, moduleName);

        const sanitizedChart = sanitizeOutput(dentalChart, chartModuleName);

        const res = {
            dentalChart: {
                ...sanitizedChart,
            },
            dentalRecord: {
                ...sanitizedRecord,
            },
        };
        
		return res;
    }
}));
