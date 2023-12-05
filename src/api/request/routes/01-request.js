module.exports = {
	routes: [
		{
			method: 'PUT',
			path: '/requests/:id/cancel',
			handler: 'request.cancel',
		},
	],
};
