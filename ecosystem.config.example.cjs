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
				DRAX_JWT_SECRET: '',
				DRAX_JWT_EXPIRATION: '2h',
				DRAX_JWT_ISSUER: 'DRAX SCAFFOLD',
				DRAX_APIKEY_SECRET:'',

				//DB
				DRAX_DB_ENGINE: 'mongo', //sqlite or mongo
				DRAX_MONGO_URI: 'mongodb://127.0.0.1:27017/drax-scaffold',
				DRAX_SQLITE_FILE: 'drax.db',

				//#MEDIA
				DRAX_PORT: '8080',
				DRAX_BASE_URL: 'http://localhost:9090',
				DRAX_MAX_UPLOAD_SIZE: '5000000',
				DRAX_FILE_DIR: 'uploads',
			}
		}

	]
};
