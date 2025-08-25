import { MovieModel } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movie.js";

export class MovieController {
  // Controlador para listar peliculas
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    // lo que se va renderizar
    res.json(movies);
  }

  // Controlador para obtener una pelicula por id
  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie not found" });
  }

  // Controlador para crear una nueva pelicula
  static async create(req, res) {
    const result = validateMovie(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  }

  // Controlador para eliminar una pelicula por su id
  static async delete(req, res) {
    const { id } = req.params;
    const movieDelete = await MovieModel.delete({ id });

    if (movieDelete === false) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.json({ message: "Movie deleted" });
  }

  // Controlador para actualizar una pelicula por su id
  static async update(req, res) {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieUpdate = await MovieModel.update({ id, input: result.data });

    if (!movieUpdate) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.json(movieUpdate);
  }
}
