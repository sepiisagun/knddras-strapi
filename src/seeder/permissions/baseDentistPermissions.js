module.exports = {
	'api::dental-chart': {
		controllers: {
			'dental-chart': {
				create: {
					enabled: true,
				},
				find: {
					enabled: true,
				},
				findOne: {
					enabled: true,
				},
			},
		},
	},
	'api::dental-record': {
		controllers: {
			'dental-record': {
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
	'api::teeth-record': {
		controllers: {
			'teeth-record': {
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
	'api::tooth': {
		controllers: {
			tooth: {
				find: {
					enabled: true,
				},
			},
		},
	},
	'api::tooth-status': {
		controllers: {
			'tooth-status': {
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
				patients: {
					enabled: true,
				},
			},
		},
	},
};
