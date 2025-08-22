// npm install zod -E
const z = require("zod"); //usual para validaciones rapidas

//uso de zod para validaciones rapidas
const movieScheme = z.object({
  title: z.string({
    invalid_type_error: "El titulo de la pelicula debe ser una cadena de texto",
    required_error: "El titulo de la pelicula es requerido",
  }),
  year: z.number().int().positive().min(1900).max(2026),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: "La URL debe ser una URL valida",
  }),
  genre: z.array(
    z.enum([
      "Adventure",
      "Drama",
      "Sci-Fi",
      "Action",
      "Comedy",
      "Biography",
      "Adventure",
      "Fantasy",
    ]),
    {
      required_error: "El genero de la pelicula es requerido",
      invalid_type_error:
        "El genero de la pelicula debe ser un arreglo de cadenas de texto",
    }
  ),
});

function validateMovie(input) {
  return movieScheme.safeParse(input);
}

function validatePartialMovie(input) {
  return movieScheme.partial().safeParse(input);
}

module.exports = {
  validateMovie,
  validatePartialMovie,
};
