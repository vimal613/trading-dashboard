import { useEffect, useState } from "react";
import axios from "axios";

export default function MasterDashboardPage() {

  const [scan, setScan] = useState(null);
  const [power, setPower] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [portfolioBrain, setPortfolioBrain] = useState(null);

  const loadData = () => {
    axios.get("http://127.0.0.1:8000/scan")
      .then(res => setScan(res.data));

    axios.get("http://127.0.0.1:8000/power-meter")
      .then(res => setPower(res.data));

    axios.get("http://127.0.0.1:8000/morning-briefing")
      .then(res => setBriefing(res.data));

    axios.get("http://127.0.0.1:8000/portfolio-brain")
      .then(res => setPortfolioBrain(res.data));
  };

  useEffect(() => {
    loadData();
    const i = setInterval(loadData, 10000);
    return () => clearInterval(i);
  }, []);

  if (!scan || !power || !briefing || !portfolioBrain) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const card = {
    background: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  };

  return (
    <div style={{
      padding: 20,
      maxWidth: 1200,
      margin: "0 auto",
      background: "#f5f7fb",
      minHeight: "100vh"
    }}>

      <h1>🚀 Master Dashboard (Live Mode)</h1>

      {/* MARKET MESSAGE */}
      {scan.stocks.length === 0 && (
        <div style={{
          background: "#fff3cd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16
        }}>
          ⚠️ {scan.reason}
        </div>
      )}

      {/* POWER METER */}
      <div style={card}>
        <h3>⚡ Intraday Power Meter</h3>
        <b>{power.power} — {power.zone}</b>
      </div>

      {/* MORNING BRIEFING */}
      <div style={card}>
        <h3>🌅 Morning Briefing</h3>
        Signal: <b>{briefing.signal}</b><br />
        {briefing.advice}
      </div>

      {/* PORTFOLIO BRAIN */}
      <div style={card}>
        <h3>🧠 Portfolio Brain (1% Goal Planner)</h3>
        <b>{portfolioBrain.market_mode}</b><br />
        Suggested Trades: {portfolioBrain.suggested_trades}<br />
        Goal Probability: <b>{portfolioBrain.goal_probability}</b><br />
        {portfolioBrain.message}
      </div>

      {/* SCANNER RESULTS */}
      <div style={card}>
        <h3>🔥 Live Scanner Results</h3>

        {scan.stocks.length === 0 ? (
          <div>No setups right now.</div>
        ) : (
          scan.stocks.slice(0, 10).map((s, i) => {

            const bg =
              s.signal === "ENTER NOW" ? "#d4edda" :
              s.signal === "WAIT" ? "#fff3cd" :
              "#f8d7da";

            return (
              <div key={i} style={{
                padding: "10px",
                marginBottom: 8,
                borderRadius: 6,
                background: bg
              }}>
                <b>{s.stock}</b> — ₹{s.price}<br />
                Rating: {s.rating} | Momentum: {s.momentum}%<br />
                🎯 Target: ₹{s.target} | 🛑 Stop: ₹{s.stop_loss}<br />
                ⚖️ R/R: {s.rr_ratio}<br />
                <b>
                  {s.signal === "ENTER NOW" && "🟢 ENTER NOW"}
                  {s.signal === "WAIT" && "🟡 WAIT"}
                  {s.signal === "AVOID" && "🔴 AVOID"}
                </b>
              </div>
            );
          })
        )}
      </div>

      {/* HOW TO USE */}
      <div style={card}>
        <h3>📘 How to Use</h3>
        1️⃣ Check Morning Briefing → GO signal.<br />
        2️⃣ Focus on A+ or ENTER NOW stocks.<br />
        3️⃣ Use target & stop-loss shown.<br />
        4️⃣ Start with paper trading first.
      </div>

      {/* BUY CRITERIA */}
      <div style={card}>
        <h3>✅ Buy Criteria</h3>
        • Rating A+ preferred<br />
        • Signal = ENTER NOW or WAIT<br />
        • Momentum positive<br />
        • Power meter not WEAK
      </div>

      {/* FAQ */}
      <div style={card}>
        <h3>❓ FAQ</h3>
        <b>Why no stocks sometimes?</b><br />
        Market closed or no high-quality setups.<br /><br />

        <b>Is profit guaranteed?</b><br />
        No. This is a research and decision-support tool.
      </div>

      {/* DISCLAIMER */}
      <div style={{
        background: "#ffe5e5",
        padding: 14,
        borderRadius: 8
      }}>
        ⚠️ <b>Disclaimer:</b> We are NOT SEBI registered advisors.
        This application is for educational and research purposes only.
      </div>

    </div>
  );
}
