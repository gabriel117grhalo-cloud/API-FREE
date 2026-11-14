require("dotenv").config();
const express = require("express");
const { AppDataSource } = require("./db/connection");
const { Task } = require("./db/entities/tasks");

const app = express();
app.use(express.json());

let taskRepository;

AppDataSource.initialize()
    .then(() => {
        console.log("Conectado a la base de datos de Neon.tech exitosamente");
        taskRepository = AppDataSource.getRepository(Task);

        // GET: Obtener todas las tareas
        app.get("/tasks", async (req, res) => {
            try {
                const tasks = await taskRepository.find();
                res.json(tasks);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // POST: Crear una nueva tarea
        app.post("/tasks", async (req, res) => {
            try {
                const newTask = taskRepository.create(req.body);
                const results = await taskRepository.save(newTask);
                res.status(201).json(results);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // PUT: Actualizar una tarea por ID
        app.put("/tasks/:id", async (req, res) => {
            try {
                const task = await taskRepository.findOneBy({ id: parseInt(req.params.id) });
                if (!task) {
                    return res.status(404).json({ message: "Tarea no encontrada" });
                }
                taskRepository.merge(task, req.body);
                const results = await taskRepository.save(task);
                res.json(results);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // DELETE: Eliminar una tarea por ID
        app.delete("/tasks/:id", async (req, res) => {
            try {
                const results = await taskRepository.delete(parseInt(req.params.id));
                if (results.affected === 0) {
                    return res.status(404).json({ message: "Tarea no encontrada" });
                }
                res.json({ message: "Tarea eliminada con éxito" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => console.error("Error al conectar a la BD:", error));

module.exports = app;