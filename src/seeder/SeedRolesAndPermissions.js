const { merge } = require('lodash');

const adminRole = require('./roles/admin');
const associateDentistRole = require('./roles/associateDentist');
const authenticatedRole = require('./roles/authenticated');
const dentalAssistantRole = require('./roles/dentalAssistant');
const dentistRole = require('./roles/dentist');
const publicRole = require('./roles/public');

const updateRole = async (existingRole) => {
	const role = await strapi.query('plugin::users-permissions.role').findOne({
		where: {
			type: existingRole.type,
		},
		populate: ['permissions'],
	});

	if (role) {
		await strapi.service('plugin::users-permissions.role').updateRole(role.id, {
			permissions: existingRole.permissions,
		});

		strapi.log.info(`${existingRole.name} role updated`);
	}
};

// eslint-disable-next-line no-unused-vars
const createRole = async (newRole) => {
	const role = await strapi.query('plugin::users-permissions.role').findOne({
		where: {
			type: newRole.type,
		},
	});

	if (role === null) {
		const actions = await strapi
			.service('plugin::users-permissions.users-permissions')
			.getActions();

		await strapi.service('plugin::users-permissions.role').createRole({
			...newRole,
			permissions: merge(actions, newRole.permissions),
		});

		strapi.log.info(`${newRole.name} role created`);
	} else {
		await updateRole(newRole);
	}
};

module.exports = async () => {
	await updateRole(adminRole);
	await updateRole(authenticatedRole);
	await updateRole(publicRole);

	await createRole(associateDentistRole);
	await createRole(dentalAssistantRole);
	await createRole(dentistRole);
};
