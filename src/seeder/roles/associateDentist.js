const { merge } = require('lodash');

const baseAuthenticatedPermissions = require('../permissions/baseAuthenticatedPermissions');
const baseDentistPermissions = require('../permissions/baseDentistPermissions');

module.exports = {
	name: 'Associate Dentist',
	description: 'Role given to the clinic associate dentist.',
	type: 'associate_dentist',
	permissions: merge(baseAuthenticatedPermissions, baseDentistPermissions),
};
