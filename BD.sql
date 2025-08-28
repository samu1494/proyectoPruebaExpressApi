--eliminar db previa
drop database if exists movies-database;
--creacion base de datos
create database movies-database;
-- usar
use movies-database;

-- crear tablas
create table movies (
	id binary(16) primary key default (UUID_TO_BIN(UUID())),
	title varchar(255),
	year int not null,
	director varchar(255) not null,
	duration int not null,
	poster text,
	rate decimal(2,1) unsigned not null
);

-- tabla genero 
create table genre (
	id int auto_increment primary key,
	name varchar(255) not null unique
);

-- relacion pelicula - genero
create table movie_genres (
	movie_id binary(16) references movies(id),
	genre_id int references genre(id),
	primary key (movie_id, genre_id)
);

-- insertar datos
insert into genre (name) values
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Comedy'),
('Romance');

-- insertar movies
insert into movies (id, title, year, director, duration, poster, rate) values
(UUID_TO_BIN(UUID()), "Interstellar", 2014, "Christopher Nolan", 169, "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg", 8.6),
(UUID_TO_BIN(UUID()), "Gladiator", 2000, "Ridley Scott", 155, "https://img.fruugo.com/product/0/60/14417600_max.jpg", 8.5),
(UUID_TO_BIN(UUID()), "The Lion King", 1994, "Roger Allers, Rob Minkoff", 88, "https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg", 8.5),
(UUID_TO_BIN(UUID()), "The Matrix", 1999, "Lana Wachowski", 136, "https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg", 8.7);

-- insertar generos a las pelis
insert into movie_genres (movie_id, genre_id) values
((select id from movies where title = "Interstellar"), (select id from genre where name = "Sci-Fi")),
((select id from movies where title = "Interstellar"), (select id from genre where name = "Adventure")),
((select id from movies where title = "Interstellar"), (select id from genre where name = "Drama")),
((select id from movies where title = "Gladiator"), (select id from genre where name = "Drama")),
((select id from movies where title = "Gladiator"), (select id from genre where name = "Action")),
((select id from movies where title = "Gladiator"), (select id from genre where name = "Romance")),
((select id from movies where title = "Gladiator"), (select id from genre where name = "Adventure")),
((select id from movies where title = "The Lion King"), (select id from genre where name = "Comedy")),
((select id from movies where title = "The Lion King"), (select id from genre where name = "Drama")),
((select id from movies where title = "The Lion King"), (select id from genre where name = "Romance")),
((select id from movies where title = "The Lion King"), (select id from genre where name = "Adventure")),
((select id from movies where title = "The Matrix"), (select id from genre where name = "Sci-Fi")),
((select id from movies where title = "The Matrix"), (select id from genre where name = "Crime")),
((select id from movies where title = "The Matrix"), (select id from genre where name = "Adventure")),
((select id from movies where title = "The Matrix"), (select id from genre where name = "Action"));

-- probando
select *, BIN_TO_UUID(id) id from movies;
select  * from genre where name = "xxx";
select  * from movie_genres;

-- probar que generos tiene una peli por el ID de la peli
SELECT g.name
FROM genre g
INNER JOIN movie_genres mg ON g.id = mg.genre_id
INNER JOIN movies m ON mg.movie_id = m.id
WHERE m.id = (
	SELECT id
	FROM movies
	WHERE title = 'Este cuerpo no es mio'
	LIMIT 1
);
