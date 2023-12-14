module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/treatments/findOne',
			handler: 'treatment.findOne',
		},
	],
};
