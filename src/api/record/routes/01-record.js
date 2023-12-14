module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/records/fetchUsers',
			handler: 'record.fetchUsers',
		},
		{
			method: 'POST',
			path: '/records/create-self',
			handler: 'record.createSelf',
		},
		{
			method: 'PUT',
			path: '/records/update-self/:id',
			handler: 'record.updateSelf',
		},
	],
};
