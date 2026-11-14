const { EntitySchema } = require("typeorm");

const TaskEntity = new EntitySchema({
    name: "Task",
    tableName: "tasks",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        title: {
            type: "varchar",
        },
        completed: {
            type: "boolean",
            default: false,
        },
    },
});

module.exports = { Task: TaskEntity };