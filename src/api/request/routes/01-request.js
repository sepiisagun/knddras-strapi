module.exports = {
	routes: [
		{
			method: 'PUT',
			path: '/requests/:id/cancel',
			handler: 'request.cancel',
		},
		{
			method: 'PUT',
			path: '/requests/:id/accpet',
			handler: 'request.accept',
		},
		{
			method: 'PUT',
			path: '/requests/:id/reject',
			handler: 'request.reject',
		},
	],
};
