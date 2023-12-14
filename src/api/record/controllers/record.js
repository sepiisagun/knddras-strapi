/**
 * record controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');
const sanitizeOutput = require('../../../utils/sanitizeOutput');
const formatMessage = require('../../../utils/formatMessage');

const moduleName = 'api::record.record';

const updatePatientCredentials = async (data, patientId) => {
	await strapi.entityService.update('plugin::users-permissions.user', patientId, {
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			mobileNumber: data.mobileNumber,
		},
	});
};

const processMinorData = async (data, oldGuardian, recordId) => {
	const module = 'api::guardian.guardian';
	if (data.minor === true) {
		if (_.isEmpty(oldGuardian)) {
			await strapi.entityService.create(module, {
				data: {
					name: data.guardianName,
					occupation: data.occupation,
					relation: data.relation,
					record: recordId,
				},
			});
		} else if (!_.isEmpty(oldGuardian)) {
			const guardianId = _.get(oldGuardian, 'id');
			await strapi.entityService.update(module, guardianId, {
				data: {
					name: data.guardianName,
					occupation: data.occupation,
					relation: data.relation,
				},
			});
		}
	} else if (data.minor === false && !_.isEmpty(oldGuardian)) {
		await strapi.entityService.delete(module, _.get(oldGuardian, 'id'));
	}
};

// eslint-disable-next-line no-unused-vars
module.exports = createCoreController(moduleName, ({ strapi }) => ({
	async findOne(ctx) {
		const { user } = ctx.state;
		const { id } = user;

		let [record] = await strapi.entityService.findMany(moduleName, {
			filters: {
				patient: {
					id,
				},
			},
			populate: ['patient'],
		});

		let guardian;
		record = {
			...record,
		};

		if (!_.isEmpty(record) && !_.isEmpty(_.get(record, 'guardian'))) {
			[guardian] = await strapi.entityService.findMany('api::guardian.guardian', {
				filters: {
					record: {
						id: record.id,
					},
				},
			});

			record = {
				...record,
				guardian: {
					...guardian,
				},
			};
		}

		const sanitizedEntity = await sanitizeOutput(record, moduleName);

		return sanitizedEntity;
	},

	async createSelf(ctx) {
		const { data } = ctx.request.body;
		// process records
		const record = await strapi.entityService.create(moduleName, {
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				middleInitial: data.middleInitial,
				sex: data.sex,
				birthdate: data.birthdate,
				religion: data.religion,
				nationality: data.nationality,
				address: data.address,
				minor: data.minor,
				patient: data.patient,
			},
			populate: {
				patient: {
					fields: ['id'],
				},
			},
		});

		processMinorData(data, null, _.get(record, 'id'));

		const sanitizedEntity = await sanitizeOutput(record, moduleName);

		return sanitizedEntity;
	},

	async updateSelf(ctx) {
		const { id } = ctx.params;
		const { data } = ctx.request.body;

		const oldRecord = await strapi.entityService.findOne(moduleName, id, {
			populate: { patient: true },
		});

		const record = await strapi.entityService.update(moduleName, id, {
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				middleInitial: data.middleInitial,
				sex: data.sex,
				birthdate: data.birthdate,
				religion: data.religion,
				nationality: data.nationality,
				address: data.address,
				minor: data.minor,
			},
		});

		const patientId = _.get(oldRecord, 'patient.id');
		updatePatientCredentials(data, patientId);

		const [oldGuardian] = await strapi.entityService.findMany('api::guardian.guardian', {
			filters: {
				record: {
					id: oldRecord.id,
				},
			},
		});

		processMinorData(data, oldGuardian, _.get(record, 'id'));

		const sanitizedEntity = await sanitizeOutput(record, moduleName);

		return sanitizedEntity;
	},

	async create(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { data } = ctx.request.body;
		const { conditions, dental, medical, record: recordData } = data;

		// process records
		const record = await strapi.entityService.create(moduleName, {
			data: {
				firstName: recordData.firstName,
				lastName: recordData.lastName,
				middleInitial: recordData.middleInitial,
				sex: recordData.sex,
				birthdate: recordData.birthdate,
				religion: recordData.religion,
				nationality: recordData.nationality,
				address: recordData.address,
				minor: recordData.minor,
				patient: recordData.patient,
			},
			populate: {
				patient: {
					fields: ['id'],
				},
			},
		});

		if (user.role.type === 'authenticated') {
			updatePatientCredentials(recordData, _.get(user, 'id'));
		}
		processMinorData(data, null, _.get(record, 'id'));

		// process medical history
		if (!_.isEmpty(medical)) {
			await strapi.entityService.create('api::medical.medical', {
				data: {
					...medical,
					record: record.id,
				},
			});
		}

		// process conditions
		if (!_.isEmpty(conditions)) {
			await strapi.entityService.create('api::condition.condition', {
				data: {
					conditions,
					record: record.id,
				},
			});
		}

		// process dental record
		if (!_.isEmpty(dental)) {
			await strapi.entityService.create('api::dental-record.dental-record', {
				data: {
					...dental,
					record: record.id,
				},
			});
		}

		const sanitizedEntity = await sanitizeOutput(record, moduleName);

		return sanitizedEntity;
	},

	async update(ctx) {
		const { id } = ctx.params;
		const { data } = ctx.request.body;

		const oldRecord = await strapi.entityService.findOne(moduleName, id, {
			populate: { patient: true },
		});

		const record = await strapi.entityService.update(moduleName, id, {
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				middleInitial: data.middleInitial,
				sex: data.sex,
				birthdate: data.birthdate,
				religion: data.religion,
				nationality: data.nationality,
				address: data.address,
				minor: data.minor,
			},
		});

		const patientId = _.get(oldRecord, 'patient.id');
		updatePatientCredentials(data, patientId);

		const [oldGuardian] = await strapi.entityService.findMany('api::guardian.guardian', {
			filters: {
				record: {
					id: oldRecord.id,
				},
			},
		});

		processMinorData(data, oldGuardian, _.get(record, 'id'));

		const sanitizedEntity = await sanitizeOutput(record, moduleName);

		return sanitizedEntity;
	},

	async fetchUsers(ctx) {
		const { state } = ctx;
		const { user } = state;
		const { role } = user;

		if (role.type === 'dental_assistant') {
			const patientIds = await strapi.entityService.findMany(moduleName, {
				fields: [],
				populate: {
					patient: {
						fields: ['id'],
					},
				},
			});

			const userId = patientIds.map((item) => _.get(item, 'patient.id'));

			const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
				filters: {
					id: {
						$notIn: userId,
					},
					role: {
						type: 'authenticated',
					},
				},
				fields: ['email', 'firstName', 'lastName'],
			});

			const sanitizedEntity = await sanitizeOutput(users, 'plugin::users-permissions.user');

			return sanitizedEntity;
		}
		return ctx.badRequest(
			null,
			formatMessage({
				id: 'Record.fetchUser.forbidden',
				message: 'Permission denied.',
			}),
		);
	},
}));
