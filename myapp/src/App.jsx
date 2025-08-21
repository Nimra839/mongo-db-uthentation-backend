import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import NavbarComp from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // "login" | "signup"

  return (
    <>
      <NavbarComp setAuthMode={setAuthMode} user={user} setUser={setUser} />
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </div>
      <Footer />

      {authMode && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          setUser={setUser}
        />
      )}
    </>
  );
}
