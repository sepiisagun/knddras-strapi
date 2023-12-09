const { merge } = require('lodash');

const baseAuthenticatedPermissions = require('../permissions/baseAuthenticatedPermissions');

module.exports = {
	name: 'Patient',
	description: 'Role given for clinic patients',
	type: 'authenticated',
	permissions: merge(
		{
			'api::appointment': {
				controllers: {
					appointment: {
						update: {
							enabled: true,
						},
					},
				},
			},
			'api::condition': {
				controllers: {
					condition: {
						create: {
							enabled: true,
						},
						update: {
							enabled: true,
						},
					},
				},
			},
			'api::guardian': {
				controllers: {
					guardian: {
						create: {
							enabled: true,
						},
						update: {
							enabled: true,
						},
						delete: {
							enabled: true,
						},
					},
				},
			},
			'api::medical': {
				controllers: {
					medical: {
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
						create: {
							enabled: true,
						},
						update: {
							enabled: true,
						},
					},
				},
			},
			'plugin::users-permissions': {
				controllers: {
					user: {
						destroy: {
							enabled: true,
						},
					},
				},
			},
		},
		baseAuthenticatedPermissions,
	),
};
