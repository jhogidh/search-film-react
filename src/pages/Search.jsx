import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Search() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const { query } = useParams();

  useEffect(() => {
    getMovies();
    getGenres();
  }, [movies]);

  const getGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=595125e61351c607c465959edfc10910&language=en-US`
      );
      const data = await res.json();
      const genreMap = {};
      data.genres.forEach((g) => {
        genreMap[g.id] = g.name;
      });
      setGenres(genreMap);
    } catch (error) {
      console.log(error);
    }
  };

  async function getMovies() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=595125e61351c607c465959edfc10910`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Daftar Film
      </Typography>

      <ImageList cols={4} gap={16} >
        {movies.map((movie) => (
          <ImageListItem key={movie.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="300"
                image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="subtitle1" noWrap>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.release_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.vote_average} ⭐
                </Typography>
                <Typography>
                  Genres:{" "}
                  {movie.genre_ids
                    .map((id) => genres[id])
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </CardContent>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default Search;
