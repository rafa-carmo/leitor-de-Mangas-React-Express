// Update with your config settings.

module.exports = {

	client: 'postgresql',
		connection: {
			database: 'mangas',
			user:     'postgres',
			password: '147258369'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}

};
