import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Landing from "./pages/Landing/Landing";
import NextBus from "./pages/Dashboard/NextBus/NextBus";
import Stats from "./pages/Dashboard/Stats/Stats";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/nextbus" element={<NextBus />} />
        <Route path="/dashboard/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
