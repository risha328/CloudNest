import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import FileView from "./pages/FileView";
import FileAnalytics from "./pages/FileAnalytics";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Features from "./pages/Featurespage";
import HowItWorks from "./pages/HowItWorkspage";
import SecurityPage from "./pages/SecurityPage";
import Footer from "./components/Footer";
import PricingPage from "./pages/PricingPage";
//import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
          <Route path="/how-it-works" element={<ProtectedRoute><HowItWorks/></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />  
          <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/file/:id" element={<ProtectedRoute><FileView /></ProtectedRoute>} />
          <Route path="/analytics/:type/:id" element={<ProtectedRoute><FileAnalytics /></ProtectedRoute>} />

        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
