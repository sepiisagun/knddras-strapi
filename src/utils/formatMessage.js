module.exports = (message) => [
	{ messages: [{ id: message.id, message: message.message, field: message.field }] },
];