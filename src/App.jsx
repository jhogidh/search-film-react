import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Box, Container, Toolbar } from "@mui/material";
import Footer from "./components/Footer"; // Typo 'Foioter' diperbaiki
import { Analytics } from "@vercel/analytics/react";

function App() {
  // State query tidak lagi dibutuhkan di sini karena sudah ditangani oleh router
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* Toolbar ini berfungsi sebagai 'ganjalan' agar konten tidak tertutup Navbar */}
      <Toolbar />

      {/* DIUBAH: maxWidth diubah menjadi "xl" agar lebih lebar */}
      <Container
        maxWidth="xl"
        component="main"
        sx={{ flexGrow: 1, py: { xs: 2, sm: 3 } }}
      >
        <Outlet />
      </Container>

      <Footer />
      <Analytics />
    </Box>
  );
}

export default App;
