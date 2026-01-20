import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Event from "./pages/Event";
import Reg from "./pages/Reg";

import Payment from "./pages/Payment";
import Teampanel from "./pages/Teampanel";
import socket from "./lib/socket";
import { Analytics } from "@vercel/analytics/react";

// Reusable Protected Route Wrapper
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? children : <Navigate to="/auth" replace />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    setUser(storedUser);
  }, []);



  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <Auth />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:eventId/:teamId"
          element={
            <Payment />
          }
        />
        <Route
          path="/event/:eventID"
          element={
            <Event />
          }
        />

        <Route
          path="/reg/:eventID"
          element={
            <ProtectedRoute>
              <Reg />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teampanel/:eventId"
          element={
            <Teampanel />
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
