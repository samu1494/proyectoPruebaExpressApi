import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const moviesRouter = Router();

// ruta para obtener todas las peliculas desde el modelo
moviesRouter.get("/", MovieController.getAll);
// ruta para obtener una pelicula por su id desde el modelo
moviesRouter.get("/:id", MovieController.getById);
// ruta para crear una nueva peli, envio al modelo
moviesRouter.post("/", MovieController.create);
// ruta para eliminar una pelicula por su id desde el modelo
moviesRouter.delete("/:id", MovieController.delete);
// ruta para actualizar una pelicula por su id desde el modelo
moviesRouter.patch("/:id", MovieController.update);
