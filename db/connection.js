require("dotenv").config();
const { DataSource } = require("typeorm");
const { Task } = require("./entity/Task");

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Task],
});

module.exports = { AppDataSource };