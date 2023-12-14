/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
// @ts-nocheck
const moduleName = 'plugin::users-permissions.user';
const _ = require('lodash');
// eslint-disable-next-line import/no-extraneous-dependencies
const Promise = require('bluebird');

const sanitizeOutput = require('../../utils/sanitizeOutput');
const parseMultipartData = require('../../utils/parseMultipartData');
const formatMessage = require('../../utils/formatMessage');

const { EMAIL_DEFAULT_FROM_NAME_EMAIL, EMAIL_TEST_RECIPIENT } = process.env;

const emailRegExp =
	/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
		});

		const sanitzedBody = await sanitizeOutput(data, moduleName);

		ctx.body = sanitzedBody;
	};

	plugin.controllers.user.createUser = async (ctx) => {
		const { state } = ctx;
		const { user } = state;
		const { role } = user;
		const { body } = ctx.request;

		if (!user || role.type !== 'admin')
			return ctx.badRequest(null, [{ messages: [{ id: 'Permission Denied.' }] }]);

		const data = await strapi.entityService.create(moduleName, {
			data: {
				...body,
				password: 'Knddras123!@#',
			},
		});

		const sanitzedBody = await sanitizeOutput(data, moduleName);

		ctx.body = sanitzedBody;
	};

	plugin.controllers.user.updateUser = async (ctx) => {
		const { state } = ctx;
		const { user } = state;
		const { role } = user;
		const { id } = ctx.params;
		const { body } = ctx.request;

		if (!user || role.type === 'authenticated')
			return ctx.badRequest(null, [{ messages: [{ id: 'Permission Denied.' }] }]);

		const data = await strapi.entityService.update(moduleName, id, {
			data: {
				...body,
			},
		});

		const sanitzedBody = await sanitizeOutput(data, moduleName);

		ctx.body = sanitzedBody;
	};

	plugin.controllers.user.patients = async (ctx) => {
		const { state } = ctx;
		const { user } = state;
		const { filters } = ctx.request.query;

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'No authorization header was found' }] },
			]);
		}

		const data = await strapi.entityService.findMany(moduleName, {
			fields: ['firstName', 'lastName', 'mobileNumber', 'email', 'username'],
			filters: {
				role: {
					type: 'authenticated',
				},
				...filters,
			},
		});

		const sanitizedBody = await sanitizeOutput(data, moduleName);

		let patient = [];

		patient = await Promise.map(sanitizedBody, async (userData) => {
			const [record] = await strapi.entityService.findMany('api::record.record', {
				filters: {
					patient: userData.id,
				},
				populate: 'patient',
			});

			let treatment = [];
			if (!_.isEmpty(record)) {
				treatment = await strapi.entityService.findMany('api::treatment.treatment', {
					fields: ['createdAt'],
					filters: {
						record: record.id,
					},
					sort: 'createdAt:desc',
					limit: 1,
				});
			}

			const status = !_.isEmpty(record);
			return { ...userData, status, treatment };
		});

		ctx.body = patient;
	};

	plugin.controllers.user.doctors = async (ctx) => {
		const { state } = ctx;
		const { user } = state;

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'No authorization header was found' }] },
			]);
		}

		const data = await strapi.entityService.findMany(moduleName, {
			fields: ['firstName', 'lastName'],
			filters: {
				role: {
					type: {
						$in: ['associate_dentist', 'dentist'],
					},
				},
			},
		});

		const sanitzedBody = await sanitizeOutput(data, moduleName);

		ctx.body = sanitzedBody;
	};

	plugin.controllers.user.employees = async (ctx) => {
		const { state } = ctx;
		const { user } = state;
		const { role } = user;
		const { fields = [], filters } = ctx.request.query;

		if (!user) {
			return ctx.badRequest(null, [
				{ messages: [{ id: 'No authorization header was found' }] },
			]);
		}

		if (role.type !== 'admin') {
			return ctx.badRequest(null, [{ messages: [{ id: 'Permission denied.' }] }]);
		}

		const data = await strapi.entityService.findMany(moduleName, {
			fields: [...fields],
			filters: {
				role: {
					type: {
						$in: ['associate_dentist', 'dentist', 'dental_assistant'],
					},
				},
				...filters,
			},
			populate: ['role'],
		});

		const sanitzedBody = await sanitizeOutput(data, moduleName);

		ctx.body = sanitzedBody;
	};

	plugin.controllers.auth.register = async (ctx) => {
		const pluginStore = await strapi.store({
			environment: '',
			type: 'plugin',
			name: 'users-permissions',
		});

		const settings = await pluginStore.get({
			key: 'advanced',
		});

		if (!settings.allow_register) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.advanced.allow_register',
					message: 'Register action is currently disabled.',
				}),
			);
		}

		const { data, files } = ctx.is('multipart') ? parseMultipartData(ctx) : {};

		let params = {
			..._.omit(data || ctx.request.body, [
				'confirmed',
				'confirmationToken',
				'resetPasswordToken',
			]),
			provider: 'local',
		};

		params = {
			...params,
			email: params.emailAddress,
		};

		delete params.emailAddress;

		// Password is required.
		if (!params.password) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.form.error.password.provide',
					message: 'Please provide your password.',
				}),
			);
		}

		// Email is required.
		if (!params.email) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.form.error.email.provide',
					message: 'Please provide your email.',
				}),
			);
		}

		let role;
		if (_.isEmpty(params.role)) {
			role = await strapi.entityService.findMany('plugin::users-permissions.role', {
				filters: {
					type: settings.default_role,
				},
			});

			[role] = role;

			params.role = role.id;
		}

		if (!role) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.form.error.role.notFound',
					message: 'Impossible to find the default role.',
				}),
			);
		}

		// Check if the provided email is valid or not.
		const isEmail = emailRegExp.test(params.email);

		if (isEmail) {
			params.email = params.email.toLowerCase();
		} else {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.form.error.email.format',
					message: 'Please provide valid email address.',
				}),
			);
		}

		// Check email if user exists
		let user = await strapi.entityService.findMany(moduleName, {
			filters: {
				email: params.email,
			},
		});

		[user] = user;

		if (user && user.provider === params.provider) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.form.error.email.taken',
					message: 'Email is already taken.',
				}),
			);
		}

		if (user && user.provider !== params.provider && settings.unique_email) {
			return ctx.badRequest(
				null,
				formatMessage({
					id: 'Auth.form.error.email.taken',
					message: 'Email is already taken.',
				}),
			);
		}

		try {
			if (!settings.email_confirmation) {
				params.confirmed = true;
			}

			// Create user
			user = await strapi.entityService.create(moduleName, {
				data: {
					...params,
					username: params.email,
				},
			});

			/**
			 * Configure email settings first
			 */
			// // Send registration email
			// await strapi
			// 	.service('plugin::users-permissions.user')
			// 	.sendEmailNotification({ email: user.email }, 'Test Subject', 'Test Body', {
			// 		name: `${user.email}`,
			// 		contactEmail: `sample@email.com`,
			// 	});

			// Append files
			if (files) {
				await strapi.entityService.uploadFiles(user, files, {
					model: 'user',
					source: 'users-permissions',
				});
			}

			const sanitizedUser = await sanitizeOutput(
				!files ? user : await strapi.entityService.findOne(moduleName, user.id),
				moduleName,
			);

			// Send email confirmation email
			if (settings.email_confirmation) {
				try {
					await strapi
						.service('plugin::users-permissions.user')
						.sendConfirmationEmail(user);
				} catch (err) {
					return ctx.badRequest(null, err);
				}

				return ctx.send({ user: sanitizedUser });
			}

			const jwt = strapi.service('plugin::users-permissions.jwt').issue(_.pick(user, ['id']));

			return ctx.send({
				jwt,
				user: sanitizedUser,
			});
		} catch (err) {
			const adminError = _.includes(err.message, 'username')
				? {
						id: 'Auth.form.error.username.taken',
						message: 'Username already taken.',
					}
				: { id: 'Auth.form.error.email.taken', message: 'Email already taken.' };

			strapi.log.error('****ERROR MSG:', err);

			ctx.badRequest(null, formatMessage(adminError));
		}
	};

	/**
	 * Users-Permissions Services
	 */

	plugin.services.user.sendEmailNotification = (
		user,
		subject,
		template,
		values,
		appendSignature = true,
	) => {
		let finalTemplate = template;

		const to = EMAIL_TEST_RECIPIENT;

		strapi.log.info(
			`Sending email notification inteded for ${user.email} to ${EMAIL_TEST_RECIPIENT}...`,
		);

		if (appendSignature) {
			finalTemplate = `${template}<p>---</p><p>KNDDRAS</p>`;
		}

		strapi.plugins.email.services.email.sendTemplatedEmail(
			{
				from: EMAIL_DEFAULT_FROM_NAME_EMAIL,
				to,
			},
			{
				subject,
				text: finalTemplate,
				html: finalTemplate,
			},
			values,
		);
	};

	/**
	 * Users-Permissions Routes
	 */

	plugin.routes['content-api'].routes.push({
		method: 'GET',
		path: '/users/me',
		handler: 'user.me',
		config: {
			policies: [],
		},
	});

	plugin.routes['content-api'].routes.push({
		method: 'PUT',
		path: '/users/update/:id',
		handler: 'user.updateUser',
		config: {
			policies: [],
		},
	});

	plugin.routes['content-api'].routes.push({
		method: 'POST',
		path: '/users/create',
		handler: 'user.createUser',
		config: {
			policies: [],
		},
	});

	plugin.routes['content-api'].routes.push({
		method: 'GET',
		path: '/users/patients',
		handler: 'user.patients',
		config: {
			policies: [],
		},
	});

	plugin.routes['content-api'].routes.push({
		method: 'GET',
		path: '/users/doctors',
		handler: 'user.doctors',
		config: {
			policies: [],
		},
	});

	plugin.routes['content-api'].routes.push({
		method: 'GET',
		path: '/users/employees',
		handler: 'user.employees',
		config: {
			policies: [],
		},
	});

	return plugin;
};
