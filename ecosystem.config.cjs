module.exports = {
	apps: [
		{
			name: 'DRAX SCAFFOLD',
			script: './out/index.js',
			instances: 1,
			env: {
				NODE_ENV: 'production',
				HOST: '0.0.0.0',
				PORT: '9090',

				//JWT
				DRAX_JWT_SECRET:'u2OcSvAOk7e8Jbknpm33nwgf',
				DRAX_JWT_EXPIRATION:'2h',
				DRAX_JWT_ISSUER:'DRAX',

				//DB
				DRAX_DB_ENGINE:'mongo', //sqlite or mongo
				DRAX_MONGO_URI:'mongodb://127.0.0.1:27017/drax',
				DRAX_SQLITE_FILE:'drax.db',
			}
		}

	]
};
