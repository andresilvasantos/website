module.exports = {
	cookieSecret: "COOKIE_PASSWORD",
	db: {
		host: "localhost",
		name: "DB_NAME",
		password: "DB_ADMIN_PASSWORD",
		port: 27017,
		username: "DB_ADMIN_USER"
	},
	production: false,
	server: {
		address: "127.0.0.1",
		port: 3000
	},
	user: {
		email: 'USER_EMAIL',
		username: 'USER_USERNAME',
		password: 'USER_PASSWORD'
	}
}
