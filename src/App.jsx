import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/Policy";


function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/landing" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/landing" replace />;

  return children;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute roles={["job_seeker", "employer", "admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["job_seeker", "employer"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute roles={["job_seeker", "employer"]}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute roles={["job_seeker", "employer"]}>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}
