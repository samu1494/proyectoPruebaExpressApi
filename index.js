import express, { json } from "express"; // require -> commonJS
import { createMovieRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

export const createApp = ({ movieModel }) => {
  //middlewares
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by"); // deshabilitar el header X-Powered-By: Express

  // -> Rutas
  // ->
  app.use("/movies", createMovieRouter({ movieModel }));

  const PORT = process.env.PORT ?? 1234;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
