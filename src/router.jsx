import { createBrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import App from "./App";
import Movies from "./pages/Movies";
import TopRated from "./pages/TopRated";
import Popular from "./pages/Popular";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Movies />,
      },
      {
        path: "search/:query",
        element: <Search />,
      },
      {
        path: "top-rated",
        element: <TopRated />,
      },
      {
        path: "popular",
        element: <Popular />,
      },
    ],
  },
]);

export default router;
