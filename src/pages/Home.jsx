import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardMedia,
  Skeleton,
  IconButton,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import Star from "@mui/icons-material/Star";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosNewIcon from "@mui/icons-material/ArrowForwardIos";

const apiKey = "595125e61351c607c465959edfc10910";

// --- ANIMASI CSS ---
const keyframes = `
  @keyframes kenburns {
    0% {
      transform: scale(1) translate(0, 0);
    }
    100% {
      transform: scale(1.1) translate(-2%, 2%);
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Fungsi bantuan untuk mengambil data film
const fetchMovies = async (endpoint) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US&page=1`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch movies.");
  }
  const data = await response.json();
  return data.results;
};

// Komponen Korsel Film
const MovieCarousel = ({ title, movies, isLoading, viewAllLink }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{ my: 4, position: "relative", "&:hover .nav-arrow": { opacity: 1 } }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, px: { xs: 0, md: 2 } }}
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <Button component={Link} to={viewAllLink} size="small">
          Lihat Semua
        </Button>
      </Stack>
      <IconButton
        className="nav-arrow"
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          left: -10,
          top: "55%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          opacity: 0,
          transition: "opacity 0.3s",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          display: { xs: "none", md: "flex" },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <Stack
        ref={scrollRef}
        direction="row"
        spacing={2}
        sx={{
          overflowX: "auto",
          pb: 2,
          px: { xs: 0, md: 2 },
          scrollSnapType: "x mandatory",
          "& > *": { scrollSnapAlign: "start" },
          "&::-webkit-scrollbar": { height: "8px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.4)" },
          },
        }}
      >
        {isLoading
          ? Array.from(new Array(10)).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={180}
                height={270}
                sx={{ borderRadius: 3, flexShrink: 0 }}
              />
            ))
          : movies.map((movie) => (
              <Card
                key={movie.id}
                component={Link}
                to={`/movie/${movie.id}`}
                sx={{
                  minWidth: { xs: 150, sm: 180 },
                  flexShrink: 0,
                  textDecoration: "none",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.4)",
                  },
                  "&:hover .overlay": { opacity: 1 },
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                      : `https://placehold.co/300x450/222/fff?text=No+Image`
                  }
                  alt={movie.title}
                  sx={{ height: { xs: 225, sm: 270 } }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "60%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.95) 20%, transparent)",
                    color: "white",
                    p: 1.5,
                    opacity: 0,
                    transition: "opacity 0.4s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Star sx={{ color: "gold", fontSize: 14 }} />
                    <Typography variant="caption">
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
      </Stack>
      <IconButton
        className="nav-arrow"
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          right: -10,
          top: "55%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          opacity: 0,
          transition: "opacity 0.3s",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          display: { xs: "none", md: "flex" },
        }}
      >
        <ArrowForwardIosNewIcon />
      </IconButton>
    </Box>
  );
};

// Komponen Bagian Hero Slideshow
const HeroSection = ({ movies, isLoading }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      const timer = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 7000); // Ganti slide setiap 7 detik
      return () => clearInterval(timer);
    }
  }, [isLoading, movies]);

  const activeMovie = movies[activeIndex];

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "60vh", sm: "70vh", md: "80vh" },
        width: "100%",
        color: "white",
        borderRadius: { xs: 0, md: 4 },
        overflow: "hidden",
        mb: 4,
        "&:hover .glow-button": {
          boxShadow: `0 0 15px ${theme.palette.primary.main}, 0 0 25px ${theme.palette.primary.main}`,
        },
      }}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      ) : (
        <>
          {movies.map((movie, index) => (
            <Box
              key={movie.id}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: index === activeIndex ? 1 : 0,
                transition: "opacity 1.5s ease-in-out",
                zIndex: -2,
              }}
            >
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt={movie.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  animation: "kenburns 20s ease-out infinite alternate",
                }}
              />
            </Box>
          ))}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `radial-gradient(circle at 0% 100%, ${theme.palette.primary.dark} 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 80%)`,
              zIndex: -1,
            }}
          />

          <Stack
            spacing={2}
            sx={{
              p: { xs: 3, md: 6 },
              width: { xs: "100%", md: "60%" },
              zIndex: 1,
              position: "absolute",
              bottom: 0,
            }}
          >
            {/* Menggunakan 'key' untuk me-restart animasi teks saat slide berubah */}
            <Box key={activeMovie?.id}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                sx={{ animation: "fadeInUp 0.8s 0.2s ease-out backwards" }}
              >
                {activeMovie?.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  animation: "fadeInUp 0.8s 0.4s ease-out backwards",
                }}
              >
                {activeMovie?.overview}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  mt: 3,
                  animation: "fadeInUp 0.8s 0.6s ease-out backwards",
                }}
              >
                <Button
                  className="glow-button"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  component={Link}
                  to={`/movie/${activeMovie?.id}`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition:
                      "box-shadow 0.4s ease, background-color 0.4s ease",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)" },
                  }}
                >
                  Learn More
                </Button>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Star sx={{ color: "gold" }} />
                  <Typography variant="h6">
                    {activeMovie?.vote_average?.toFixed(1)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>

          {/* Navigasi Titik */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
            }}
          >
            {movies.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor:
                    index === activeIndex
                      ? "primary.main"
                      : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "background-color 0.3s, transform 0.3s",
                  "&:hover": { transform: "scale(1.2)" },
                }}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllMovies = async () => {
      setIsLoading(true);
      try {
        const [nowPlayingData, popularData, topRatedData, upcomingData] =
          await Promise.all([
            fetchMovies("movie/now_playing"),
            fetchMovies("movie/popular"),
            fetchMovies("movie/top_rated"),
            fetchMovies("movie/upcoming"),
          ]);
        setNowPlaying(nowPlayingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);
      } catch (error) {
        console.error("Error fetching homepage movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllMovies();
  }, []);

  // Mengambil 5 film pertama untuk slideshow
  const heroMovies = nowPlaying.slice(0, 5);

  return (
    <Box>
      <style>{keyframes}</style>
      <HeroSection movies={heroMovies} isLoading={isLoading} />
      <MovieCarousel
        title="Now Playing"
        movies={nowPlaying}
        isLoading={isLoading}
        viewAllLink="/now-playing"
      />
      <MovieCarousel
        title="Popular"
        movies={popular}
        isLoading={isLoading}
        viewAllLink="/popular"
      />
      <MovieCarousel
        title="Top Rated"
        movies={topRated}
        isLoading={isLoading}
        viewAllLink="/top-rated"
      />
      <MovieCarousel
        title="Upcoming"
        movies={upcoming}
        isLoading={isLoading}
        viewAllLink="/upcoming"
      />
    </Box>
  );
}

export default Home;
