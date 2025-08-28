import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();
  const movieController = new MovieController({ movieModel });

  // ruta para obtener todas las peliculas desde el modelo
  moviesRouter.get("/", movieController.getAll);
  // ruta para obtener una pelicula por su id desde el modelo
  moviesRouter.get("/:id", movieController.getById);
  // ruta para crear una nueva peli, envio al modelo
  moviesRouter.post("/", movieController.create);
  // ruta para eliminar una pelicula por su id desde el modelo
  moviesRouter.delete("/:id", movieController.delete);
  // ruta para actualizar una pelicula por su id desde el modelo
  moviesRouter.patch("/:id", movieController.update);

  return moviesRouter;
};
