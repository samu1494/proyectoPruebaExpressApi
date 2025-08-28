//agregar mysql actualmente: npm i mysql2
import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3307,
  password: "admin",
  database: "movies-database",
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  // Modelo para listar peliculas
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [genres] = await connection.query(
        `SELECT m.title, 
        m.year, 
        m.director, 
        m.duration, 
        m.poster, 
        m.rate, 
        BIN_TO_UUID(m.id) id 
        FROM movies m 
        INNER JOIN movie_genres mg ON m.id = mg.movie_id 
        INNER JOIN genre g ON mg.genre_id = g.id
        WHERE LOWER(g.name) = ?
        GROUP BY m.id, m.title, m.year, m.director, m.duration, m.poster, m.rate;`,
        [lowerCaseGenre]
      );

      if (genres.length === 0) return [];

      return await Promise.all(
        genres.map(async (genre) => {
          return {
            ...genre,
            genres: await this.getGenres({ id: genre.id }),
          };
        })
      );
    }
    // esta consulta sql retorna dos parametros como un vector, desestructurar [result, informacion_tabla]
    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies;"
    );
    return await Promise.all(
      movies.map(async (movie) => {
        return {
          ...movie,
          genres: await this.getGenres({ id: movie.id }),
        };
      })
    );
  }

  // Modelo para obtener una pelicula por su id
  static async getById({ id }) {
    const [movie] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies WHERE id = UUID_TO_BIN(?);",
      [id]
    );

    if (movie.length === 0) return null;
    // return movie[0];
    return {
      ...movie[0],
      genres: await this.getGenres({ id: movie[0].id }),
    };
  }

  // Modelo para crear una pelicula
  static async create({ input }) {
    const { title, year, director, duration, poster, rate, genre } = input;

    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    const genreIds = await this.validateAndGetGenreIds(genre, connection);
    if (genreIds === false) return null;

    try {
      await connection.query(
        `
        INSERT INTO movies (id, title, year, director, duration, poster, rate) VALUES
        (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);
      `,
        [uuid, title, year, director, duration, poster, rate]
      );
    } catch (e) {
      throw new Error("Error creating movie");
    }

    for (const genreId of genreIds) {
      await connection.query(
        "INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);",
        [uuid, genreId]
      );
    }

    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies WHERE id = UUID_TO_BIN(?);",
      [uuid]
    );
    return movies[0];
  }

  // Modelo para eliminar una pelicula
  static async delete({ id }) {
    if (!id) return false;

    try {
      await connection.query("DELETE FROM movies WHERE id = UUID_TO_BIN(?);", [
        id,
      ]);
    } catch (error) {
      console.error("Error al eliminar la película:", error.message);
      return false;
    }
  }

  // Modelo para actualizar una pelicula
  static async update({ id, input }) {
    if (!id) return null;
  }

  //Funcion: obtener los IDs de los generos
  static async validateAndGetGenreIds(genreNames, connection) {
    const idsGenre = [];
    try {
      for (const genreName of genreNames) {
        const [rows] = await connection.query(
          "SELECT id FROM genre WHERE LOWER(name) = LOWER(?);",
          [genreName]
        );

        // Si no existe el género, retornamos false
        if (rows.length === 0) {
          return false;
        }

        // Si existe, guardamos su ID
        idsGenre.push(rows[0].id);
      }

      // Si llegamos aquí, es porque todos los géneros existen
      return idsGenre;
    } catch (error) {
      console.error("Error, genero no encontrado en la BD:", error.message);
      // Si hay un error en la consulta o en la transformación de los datos,
      // retornamos un array vacío para no romper la aplicación
      return null;
    }
  }

  // Funcion: obtener los generos de una peli
  static async getGenres({ id }) {
    try {
      // Validar que el id no sea null o undefined
      if (!id) {
        throw new Error("El ID de la película es requerido");
      }

      const [genres] = await connection.query(
        `
        SELECT g.name
        FROM genre g
        INNER JOIN movie_genres mg ON g.id = mg.genre_id
        INNER JOIN movies m ON mg.movie_id = m.id
        WHERE m.id = UUID_TO_BIN(?);
      `,
        [id]
      );

      if (genres.length === 0) return [];
      return genres.map((genre) => genre.name);
    } catch (error) {
      console.error("Error al obtener géneros de la película:", error.message);
      // Si hay un error en la consulta o en la transformación de los datos,
      // retornamos un array vacío para no romper la aplicación
      return [];
    }
  }
}
