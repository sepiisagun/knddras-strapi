const { sanitize } = require('@strapi/utils');

const { contentAPI } = sanitize;

module.exports = (data, model) => {
	const schema = strapi.getModel(model);

	return contentAPI.output(data, schema);
};