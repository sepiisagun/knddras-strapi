module.exports = ({ env }) => ({
	email: {
		config: {
			provider: 'nodemailer',
			providerOptions: {
				host: 'smtp.gmail.com',
				port: 587,
				auth: {
					user: 'sefserver.de@gmail.com',
					pass: 'vtlndmtjnllvvvuu',
				},
				// ... any custom nodemailer options
			},
			settings: {
				defaultFrom: 'enggsf@sefserver.de',
				defaultReplyTo: 'enggsf@sefserver.de',
			},
		},
	},
	upload: {
		config: {
			provider: 'aws-s3',
			providerOptions: {
				accessKeyId: env('AWS_ACCESS_KEY_ID'),
				secretAccessKey: env('AWS_ACCESS_SECRET'),
				region: env('AWS_REGION'),
				params: {
					ACL: env('AWS_ACL', 'public-read'),
					signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
					Bucket: env('AWS_BUCKET'),
				},
			},
			actionOptions: {
				upload: {},
				uploadStream: {},
				delete: {},
			},
		},
	},
	transformer: {
		enabled: true,
		config: {
			responseTransforms: {
				removeAttributesKey: true,
			},
		},
	},
});
