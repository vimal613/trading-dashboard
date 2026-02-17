import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

      {/* Top Navigation */}
      <Navbar />

      {/* Pages */}
      <Routes>

        {/* Master Dashboard */}
        <Route path="/" element={<MasterDashboardPage />} />

        {/* Scanner */}
        <Route path="/scanner" element={<DashboardPage />} />

        {/* Paper Trades */}
        <Route path="/paper-trades" element={<PaperTradePage />} />

        {/* Replay */}
        <Route path="/replay" element={<HistoricalReplayPage />} />

        {/* Edge Score */}
        <Route path="/edge-score" element={<EdgeScorePage />} />

        {/* Live Logs */}
        <Route path="/logs" element={<ScannerLogsPage />} />

        {/* Safety fallback (prevents blank pages) */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </BrowserRouter>
  );
}
