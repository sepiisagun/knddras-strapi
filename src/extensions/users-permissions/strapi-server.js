const moduleName = 'plugin::users-permissions.user';

const sanitizeOutput = require('../../utils/sanitizeOutput');

module.exports = (plugin) => {
    /**
     * Users-Permissions Controller
     */

    plugin.controllers.user.me = async (ctx) => {
        const { state } = ctx;
        const { user } = state;

        if (!user) {
            return ctx.badRequest(null, [
				{ messages: [{ id: 'No authorization header was found' }] },
			]);
        }

        const data = await strapi.entityService.findOne(moduleName, user.id, {
            populate: 'role',
        })

        const sanitzedBody = await sanitizeOutput(data, moduleName);

        ctx.body = sanitzedBody;
    }

    /**
	 * Users-Permissions Routes
	 */

	plugin.routes['content-api'].routes.push(
		{
			method: 'GET',
			path: '/users/me',
			handler: 'user.me',
			config: {
				policies: [],
			},
		}
	);

    return plugin;
}