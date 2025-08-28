import { readJSON } from "../../utils.js";
import { randomUUID } from "node:crypto";

const movies = readJSON("./movies.json");

export class MovieModel {
  // Modelo para listar peliculas
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  }

  // Modelo para obtener una pelicula por su id
  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id === id);
    return movie;
  }

  // Modelo para crear una pelicula
  static async create({ input }) {
    const newMovie = {
      id: randomUUID(), // uuid v4
      ...input,
    };

    movies.push(newMovie);
    return newMovie;
  }

  // Modelo para eliminar una pelicula
  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies.splice(movieIndex, 1);
    return true;
  }

  // Modelo para actualizar una pelicula
  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };
    return movies[movieIndex];
  }
}
