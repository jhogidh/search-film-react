import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Container } from "@mui/material";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState(" ");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Navbar query={query} handleSearch={handleSearch} />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </>
  );
}

export default App;
