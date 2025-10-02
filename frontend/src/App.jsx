import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
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
//import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/file/:id" element={<FileView />} />
          <Route path="/analytics/:type/:id" element={<FileAnalytics />} />
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
