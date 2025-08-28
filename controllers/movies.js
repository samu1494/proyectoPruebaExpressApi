// import { MovieModel } from "../models/local-file-system/movie.js";
// import { MovieModel } from "../models/mysql/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movie.js";

export class MovieController {
  // Constructor
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  // Controlador para listar peliculas
  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({ genre });
    // lo que se va renderizar
    res.json(movies);
  };

  // Controlador para obtener una pelicula por id
  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie not found" });
  };

  // Controlador para crear una nueva pelicula
  create = async (req, res) => {
    const result = validateMovie(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await this.movieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  };

  // Controlador para eliminar una pelicula por su id
  delete = async (req, res) => {
    const { id } = req.params;
    const movieDelete = await this.movieModel.delete({ id });

    if (movieDelete === false) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.json({ message: "Movie deleted" });
  };

  // Controlador para actualizar una pelicula por su id
  update = async (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieUpdate = await this.movieModel.update({
      id,
      input: result.data,
    });

    if (!movieUpdate) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.json(movieUpdate);
  };
}
