// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Obtener el perfil del usuario
      const fetchUserProfile = async () => {
        try {
          const userResponse = await fetch(
            "http://localhost:8000/api/userprofiles/current_user/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = await userResponse.json();
          setIsAdmin(userData.is_admin);

          // Redirigir a la página adecuada según el rol
          if (userData.is_admin) {
            navigate("/admin"); // Si es admin, redirigir a AdminPage
          } else {
            navigate("/landing"); // Si no es admin, redirigir a LandingPage
          }
        } catch (err) {
          console.error("Error al obtener el perfil del usuario", err);
          setToken(null);
          localStorage.removeItem("token");
          navigate("/"); // Redirigir al login si hay un error
        }
      };

      fetchUserProfile();
    } else {
      navigate("/"); // Si no hay token, redirigir al login
    }
  }, [token, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute token={token} isAdmin={isAdmin}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landing"
          element={
            <ProtectedRoute token={token} isAdmin={isAdmin}>
              <LandingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
