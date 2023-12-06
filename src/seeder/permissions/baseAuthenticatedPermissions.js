module.exports = {
	'api::appointment': {
		controllers: {
			appointment: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::condition': {
		controllers: {
			condition: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::guardian': {
		controllers: {
			guardian: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::medical': {
		controllers: {
			medical: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::procedure': {
		controllers: {
			procedure: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::record': {
		controllers: {
			record: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::request': {
		controllers: {
			request: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::treatment': {
		controllers: {
			treatment: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'plugin::users-permissions': {
		controllers: {
			auth: {
				changePassword: {
					enabled: true,
				},
				emailConfirmation: {
					enabled: true,
				},
			},
			role: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
			user: {
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
				update: {
					enabled: true,
				},
				me: {
					enabled: true,
				},
			},
		},
	},
};
