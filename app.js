const express = require("express");
const crypto = require("node:crypto"); //obtener un id encriptado
const app = express();
const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemes/movie");
const cors = require("cors");

const PORT = process.env.PORT || 1234;

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      ACCEPTED_ORIGINS = [
        "https://movies.com",
        "https://minu.dev",
        "http://localhost:8080",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Acceso no permitido"));
    },
  })
);
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.json({
    message: "hola mundo",
  });
});

// agregar una nueva peli
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error.issues });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

// -> definicion de varias rutas para CORS
ACCEPTED_ORIGINS = [
  "https://movies.com",
  "https://minu.dev",
  "http://localhost:8080",
];

// Mostrar todas las pelis o buscar una peli por su genero (depende de la variable)
app.get("/movies", (req, res) => {
  // uso de CORS, '*' es para que todos tengan acceso
  // res.header("Access-Control-Allow-Origin", "*");

  // 'http://localhost:8080' ahora solo desde el puerto 8080 se puede consumir...
  // res.header("Access-Control-Allow-Origin", "http://localhost:8080");

  // acceso de CORS para varias rutas diferentes
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    console.log(origin);
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // opcional: rechazar la petición o no enviar la cabecera
    console.log("Origen no permitido:", origin);
    res.status(403).send("CORS no permitido");
    return;
  }

  const { genre } = req.query; //si existe la variable genre en la url de la peticion
  if (genre) {
    const filterMovies = movies.filter((movie) =>
      movie.genre.some(
        (g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase()
      )
    );
    return res.json(filterMovies);
  }
  res.json(movies);
});

// Eliminar una pelicula
app.delete("/movies/:id", (req, res) => {
  // acceso de CORS para varias rutas diferentes
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    console.log(origin);
    res.header("Access-Control-Allow-Origin", origin);
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0) {
    return res.status(404).json({ message: "Pelicula no encontrada" });
  }

  movies.splice(movieIndex, 1);
  return res.json({ message: "Pelicula eliminada" });
});

// Mostrar una peli por su ID
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);

  if (movie) return res.json(movie);
  res.status(404).json({ message: "Pelicula no encontrada" });
});

// Actualizar los datos de una peli todos o solo una parte
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues });

  const { id } = req.params;
  const movieIndex = movies.findIndex((m) => m.id === id);
  if (movieIndex < 0)
    return res.status(404).json({ message: "Pelicula no encontrada" });

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;
  return res.status(201).json(updateMovie);
});

// Definicion para CORS complejas
app.options("/movies/:id", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }

  res.send(200);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});
