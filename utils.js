// import movies from "./movies.json";  // no es valido para commonJS
// import movies from "./movies.json" with { type: "json" }; //primera alternativa, usual...
//import fs from "node:fs"; //segunda forma de hacer poco usual
//const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8")); //manera de importar de forma sincrona

//forma correcta de importar un json con commonJS
// import { readJSON } from "./utils.js";
// const movies = readJSON("./movies.json");

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path);
