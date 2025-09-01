import { useEffect, useState } from "react";

function Popular() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies();
  }, []);

  async function getMovies() {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/top_rated?api_key=595125e61351c607c465959edfc10910"
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Popular</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Popular;
