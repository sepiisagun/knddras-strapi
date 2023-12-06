module.exports = {
	name: 'Admin',
	description: 'Role given to system admin.',
	type: 'admin',
	permissions: {
		'api::procedure': {
			controllers: {
				procedure: {
					create: {
						enabled: true,
					},
					find: {
						enabled: true,
					},
					findOne: {
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
		'api::tooth': {
			controllers: {
				tooth: {
					create: {
						enabled: true,
					},
					find: {
						enabled: true,
					},
					findOne: {
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
		'api::tooth-status': {
			controllers: {
				'tooth-status': {
					create: {
						enabled: true,
					},
					find: {
						enabled: true,
					},
					findOne: {
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
		'plugin::users-permissions': {
			controllers: {
				user: {
					create: {
						enabled: true,
					},
					find: {
						enabled: true,
					},
					findOne: {
						enabled: true,
					},
					update: {
						enabled: true,
					},
				},
			},
		},
	},
};
