import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectWorkspace from "./pages/ProjectWorkspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
        path="/dashboard"
        element={
        <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
        }
        />
        <Route path="/create-project" element={<CreateProject />}/>
        <Route path="/projects/:projectId" element={<ProjectWorkspace />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;