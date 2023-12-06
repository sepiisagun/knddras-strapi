const { merge } = require('lodash');

const baseAuthenticatedPermissions = require('../permissions/baseAuthenticatedPermissions');
const baseDentistPermissions = require('../permissions/baseDentistPermissions');

module.exports = {
	name: 'Dentist',
	description: 'Role given to the clinic dentist/owners.',
	type: 'dentist',
	permissions: merge(baseAuthenticatedPermissions, baseDentistPermissions),
};
