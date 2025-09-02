import {
  Box,
  Card,
  CardMedia,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import Star from "@mui/icons-material/Star";
import { useParams, useLocation, Link } from "react-router-dom";

const fadeInUpAnimation = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { query } = useParams();
  const location = useLocation();

  useEffect(() => {
    setPage(1);
  }, [query, location.pathname]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = "595125e61351c607c465959edfc10910";
        if (Object.keys(genres).length === 0) {
          const genreRes = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
          );
          const genreData = await genreRes.json();
          const genreMap = {};
          genreData.genres.forEach((g) => {
            genreMap[g.id] = g.name;
          });
          setGenres(genreMap);
        }

        let movieUrl;
        const pathname = location.pathname;
        const pageParam = `&page=${page}`;
        if (query) {
          movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}${pageParam}`;
        } else if (pathname.includes("top-rated")) {
          movieUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}${pageParam}`;
        } else if (pathname.includes("popular")) {
          movieUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}${pageParam}`;
        } else if (pathname.includes("upcoming")) {
          movieUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}${pageParam}`;
        } else {
          movieUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}${pageParam}`;
        }

        const movieRes = await fetch(movieUrl);
        const movieData = await movieRes.json();
        setMovies(movieData.results);
        setTotalPages(movieData.total_pages);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Gagal memuat data film. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [query, location.pathname, page, genres]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (movies.length === 0 && query) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Tidak ada hasil untuk "{query}"</Typography>
        <Typography color="text.secondary">Coba kata kunci lain.</Typography>
      </Box>
    );
  }

  const getPageTitle = () => {
    const pathname = location.pathname;
    if (query) return `Hasil Pencarian: "${query}"`;
    if (pathname.includes("top-rated")) return "Top Rated Movies";
    if (pathname.includes("popular")) return "Popular Movies";
    if (pathname.includes("upcoming")) return "Upcoming Movies";
    return "Now Playing";
  };

  return (
    <Box>
      <style>{fadeInUpAnimation}</style>

      <Box
        sx={{
          py: { xs: 4, md: 8 },
          mb: 6,
          textAlign: "center",
          borderRadius: 3,
          color: "white",
          background: (theme) =>
            `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, #000 90%)`,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        {/* DIUBAH: Ukuran font judul dibuat responsif */}
        <Typography
          component="h1"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "2.2rem", sm: "3rem", md: "3.75rem" },
            lineHeight: 1.2,
          }}
        >
          {getPageTitle()}
        </Typography>
        {/* DIUBAH: Ukuran font subjudul juga dibuat responsif */}
        <Typography
          sx={{ opacity: 0.7, mt: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Jelajahi koleksi terbaik pilihan kami
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {movies.map((movie, index) => (
          <Grid
            item
            key={movie.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
              opacity: 0,
              animation: "fadeInUp 0.5s ease-out forwards",
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Card
              component={Link}
              to={`/movie/${movie.id}`}
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                textDecoration: "none",
                height: "100%",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
                },
                "&:hover .movie-overlay": {
                  opacity: 1,
                },
              }}
            >
              <CardMedia
                component="img"
                height="450"
                image={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : `https://placehold.co/500x750/222/fff?text=No+Image`
                }
                alt={movie.title}
              />
              <Box
                className="movie-overlay"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.95) 25%, transparent)",
                  color: "white",
                  p: 2,
                  opacity: 0,
                  transition: "opacity 0.4s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Star sx={{ color: "gold", fontSize: 18 }} />
                    <Typography variant="body2">
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {movie.genre_ids
                      .map((id) => genres[id])
                      .filter(Boolean)
                      .slice(0, 3)
                      .join(" • ")}
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 5, alignItems: "center" }}>
          <Pagination
            count={totalPages > 500 ? 500 : totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}

export default Movies;
