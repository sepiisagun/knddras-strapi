const { merge } = require('lodash');

const baseAuthenticatedPermissions = require('../permissions/baseAuthenticatedPermissions');

module.exports = {
	name: 'Dental Assistant',
	description: 'Role given to the clinic assistant.',
	type: 'dental_assistant',
	permissions: merge(
		{
			'api::appointment': {
				controllers: {
					appointment: {
						create: {
							enabled: true,
						},
						update: {
							enabled: true,
						},
					},
				},
			},
			'api::record': {
				controllers: {
					record: {
						create: {
							enabled: true,
						},
						update: {
							enabled: true,
						},
					},
				},
			},
			'api::request': {
				controllers: {
					request: {
						update: {
							enabled: true,
						},
					},
				},
			},
		},
		baseAuthenticatedPermissions,
	),
};
