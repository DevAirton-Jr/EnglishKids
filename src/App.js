import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import GameLevel from "./pages/GameLevel";
import Lessons from "./pages/Lessons";
import Lesson from "./pages/Lesson";
import Teacher from "./pages/Teacher";

// Navbar
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/level/"); // Esconde Navbar no GameLevel

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />} {/* Só mostra Navbar fora do GameLevel */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
        <Route path="/lesson/:lessonId" element={<PrivateRoute><Lesson /></PrivateRoute>} />
        <Route path="/teacher" element={<PrivateRoute><Teacher /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/level/:levelId" element={<PrivateRoute><GameLevel /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
