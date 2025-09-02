import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Grid,
  CircularProgress,
  Alert,
  Rating,
  Card,
  CardMedia,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

// Komponen kecil untuk menampilkan informasi kunci
const InfoChip = ({ label, value }) => (
  <Stack>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="medium">
      {value}
    </Typography>
  </Stack>
);

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(true);
      setError(null);
      try {
        // DIUBAH: API key diperbaiki
        const apiKey = "595125e61351c607c465959edfc10910";

        // Fetch movie details
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        if (!movieRes.ok) throw new Error("Movie not found");
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch movie credits (cast)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`
        );
        const creditsData = await creditsRes.json();
        setCredits(creditsData);

        // Fetch recommendations
        const recommendationsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&language=en-US`
        );
        const recommendationsData = await recommendationsRes.json();
        setRecommendations(recommendationsData.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!movie) return null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : //Fallback in case date is invalid
      "N/A";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";

  return (
    <Box>
      {/* Backdrop Image */}
      <Box
        sx={{
          height: { xs: "200px", sm: "350px", md: "500px" },
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,1) 100%), url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`
            : "none",
          backgroundColor: "action.hover",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Bagian Atas: Poster dan Info Inti */}
      <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: -10, sm: -20 } }}>
        {/* DIUBAH: Tata letak dikembalikan ke horizontal dengan perataan vertikal di tengah */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, md: 4 }}
          sx={{ alignItems: "center" }}
        >
          {/* Poster */}
          <Box
            sx={{
              width: { xs: "70%", sm: "50%", md: "350px" },
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : `https://placehold.co/500x750/222/fff?text=No+Image`
              }
              alt={movie.title}
              sx={{
                width: "100%",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            />
          </Box>

          {/* Info Utama Film */}
          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: { xs: 2, md: 3 },
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              textAlign="center"
            >
              {movie.title}{" "}
              <Typography variant="h4" component="span" color="text.secondary">
                ({releaseYear})
              </Typography>
            </Typography>
            <Typography
              variant="subtitle1"
              fontStyle="italic"
              color="text.secondary"
              textAlign="center"
            >
              {movie.tagline}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              justifyContent="center"
            >
              {movie.genres.map((genre) => (
                <Chip key={genre.id} label={genre.name} variant="outlined" />
              ))}
            </Stack>

            <Typography variant="h6" mt={2}>
              Overview
            </Typography>
            <Typography paragraph color="text.secondary" sx={{ pr: 2 }}>
              {movie.overview}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Bagian Bawah: Semua Detail Lainnya */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
        <Divider sx={{ my: 4 }} />

        {/* Rating dan Info */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={2}>
              Details
            </Typography>
            <Stack direction="row" spacing={4} my={3}>
              <InfoChip label="Status" value={movie.status} />
              <InfoChip label="Runtime" value={runtime} />
              <InfoChip
                label="Budget"
                value={
                  movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "N/A"
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={2}>
              Rating
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating
                name="movie-rating"
                value={movie.vote_average / 2}
                precision={0.1}
                readOnly
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              <Typography>
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Cast */}
        <Typography variant="h6" mt={4} mb={2}>
          Cast
        </Typography>
        <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 2 }}>
          {credits?.cast.slice(0, 10).map((actor) => (
            <Box
              key={actor.cast_id}
              sx={{ textAlign: "center", minWidth: 100, flexShrink: 0 }}
            >
              <Box
                component="img"
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                    : `https://placehold.co/185x278/222/fff?text=No+Image`
                }
                alt={actor.name}
                sx={{
                  width: 100,
                  height: 150,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
              <Typography variant="body2" fontWeight="bold" mt={1}>
                {actor.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {actor.character}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <>
            <Typography variant="h6" mt={4} mb={2}>
              Recommendations
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ overflowX: "auto", pb: 2 }}
            >
              {recommendations.slice(0, 10).map((rec) => (
                <Card
                  key={rec.id}
                  component={Link}
                  to={`/movie/${rec.id}`}
                  sx={{
                    textDecoration: "none",
                    minWidth: 150,
                    flexShrink: 0,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      rec.poster_path
                        ? `https://image.tmdb.org/t/p/w300/${rec.poster_path}`
                        : `https://placehold.co/300x450/222/fff?text=No+Image`
                    }
                    alt={rec.title}
                    sx={{ height: 225, borderRadius: 1 }}
                  />
                  <Box sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                      {rec.title}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}

export default MovieDetail;
