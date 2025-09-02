import { createBrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import App from "./App";
import Movies from "./pages/Movies";

import MovieDetail from "./pages/MovieDetail";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "now-playing",
        element: <Movies />,
      },
      {
        path: "popular",
        element: <Movies />,
      },
      {
        path: "top-rated",
        element: <Movies />,
      },
      {
        path: "upcoming",
        element: <Movies />,
      },

      {
        path: "search/:query",
        element: <Movies />,
      },
      {
        path: "movie/:id",
        element: <MovieDetail />,
      },
    ],
  },
]);

export default router;
