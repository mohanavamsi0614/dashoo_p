import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Event from "./pages/Event";
import Reg from "./pages/Reg";
import { MultiStepLoader } from "./components/ui/multi-step-loader";
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const hasVisited = localStorage.getItem("hasVisited");

    setUser(storedUser);

    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem("hasVisited", "true");
      const timer = setTimeout(() => setLoading(false), 10000);
      return () => clearTimeout(timer);
    } else {
      setIsFirstVisit(false);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const firstVisitLoadingStates = [
    { text: "Starting Dashoo..." },
    { text: "Connecting to servers..." },
    { text: "Fetching your personalized data..." },
    { text: "Building the dashboard layout..." },
    { text: "Just a moment more..." },
    { text: "And we're good to go!" },
  ];

  const regularLoadingStates = [
    { text: "Loading..." },
    { text: "Getting ready..." },
  ];

  return (
    <div>
      <MultiStepLoader
        loadingStates={
          isFirstVisit ? firstVisitLoadingStates : regularLoadingStates
        }
        loading={loading}
        duration={isFirstVisit ? 2500 : 500}
      />
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
