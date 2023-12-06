module.exports = {
	name: 'Public',
	description: 'Default role given to unauthenticated user.',
	type: 'public',
	permissions: {
		'plugin::users-permissions': {
			controllers: {
				auth: {
					callback: {
						enabled: true,
					},
					connect: {
						enabled: true,
					},
					forgotPassword: {
						enabled: true,
					},
					resetPassword: {
						enabled: true,
					},
					emailConfirmation: {
						enabled: true,
					},
					register: {
						enabled: true,
					},
					sendEmailConfirmation: {
						enabled: true,
					},
				},
			},
		},
	},
};
