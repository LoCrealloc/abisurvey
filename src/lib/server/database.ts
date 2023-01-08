import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from "$env/static/private";

import { Sequelize } from "sequelize";

function connectDB() {
	return new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
}

export const db = connectDB();
