import { useState } from "react";
import axios from "axios";
import API from "../api";   // IMPORTANT

export default function HistoricalReplayPage() {

  const [selectedDate, setSelectedDate] = useState("");
  const [trades, setTrades] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState("");

  const loadReplay = async () => {
    if (!selectedDate) return;

    try {
      setStatus("Loading...");
      setError("");

      const res = await axios.get(`${API}/replay/${selectedDate}`);
      setTrades(res.data || []);
      setStatus("Loaded");
    } catch (err) {
      console.error(err);
      setError("Unable to load replay data.");
      setStatus("Error");
    }
  };

  const total = trades.length;
  const targets = trades.filter(t => t.status === "TARGET HIT").length;
  const stops = trades.filter(t => t.status === "STOP LOSS HIT").length;

  return (
    <div style={{
      padding: 20,
      maxWidth: 900,
      margin: "0 auto",
      background: "#f5f7fb",
      minHeight: "100vh"
    }}>

      {/* HEADER */}
      <h1>🕰️ Historical Replay</h1>

      {/* DATE PICKER */}
      <div style={{
        background: "white",
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>

        <input
          type="date"
          value={selectedDate}
          onChange={(e)=>setSelectedDate(e.target.value)}
          style={{ padding: 8 }}
        />

        <button
          onClick={loadReplay}
          style={{
            marginLeft: 10,
            padding: "8px 14px",
            background: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Load Day
        </button>

        <span style={{ marginLeft: 15, color: "#666", fontSize: 13 }}>
          {status}
        </span>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* SUMMARY */}
      {trades.length > 0 && (
        <div style={{
          background: "white",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          Total Trades: <b>{total}</b> | 🎯 Targets: <b>{targets}</b> | 🛑 Stops: <b>{stops}</b>
        </div>
      )}

      {/* EMPTY STATE */}
      {trades.length === 0 && status === "Loaded" && (
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: 8
        }}>
          No trades for selected date.
        </div>
      )}

      {/* TRADE LIST */}
      {trades.map((t, i) => {

        const bg =
          t.status === "TARGET HIT" ? "#d4edda" :
          t.status === "STOP LOSS HIT" ? "#f8d7da" :
          "#fff3cd";

        return (
          <div key={i} style={{
            background: bg,
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8
          }}>
            <b>{t.stock}</b><br />
            Date: {t.date}<br />
            Entry: ₹{t.entry}<br />
            🎯 Target: ₹{t.target}<br />
            🛑 Stop Loss: ₹{t.stop_loss}<br />
            Status: <b>{t.status}</b>
          </div>
        );
      })}

    </div>
  );
}
