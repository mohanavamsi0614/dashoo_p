import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Home";
import Auth from "./Auth";
import Profile from "./Profile";
import Event from "./Event";
import Reg from "./Reg";
import { MultiStepLoader } from "./components/ui/multi-step-loader";

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
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
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
          path="/event/:name"
          element={
            <ProtectedRoute>
              <Event />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reg"
          element={
            <ProtectedRoute>
              <Reg />
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
