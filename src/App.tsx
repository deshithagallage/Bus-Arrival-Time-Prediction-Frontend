import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

// import Landing from "./pages/Landing/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;