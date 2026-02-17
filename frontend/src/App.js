import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import MasterDashboardPage from "./pages/MasterDashboardPage";
import DashboardPage from "./pages/DashboardPage";
import PaperTradePage from "./pages/PaperTradePage";
import HistoricalReplayPage from "./pages/HistoricalReplayPage";
import EdgeScorePage from "./pages/EdgeScorePage";
import ScannerLogsPage from "./pages/ScannerLogsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<MasterDashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/paper-trades" element={<PaperTradePage />} />
        <Route path="/replay" element={<HistoricalReplayPage />} />
        <Route path="/edge" element={<EdgeScorePage />} />
        <Route path="/logs" element={<ScannerLogsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
