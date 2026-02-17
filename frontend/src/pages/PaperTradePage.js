import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";   // IMPORTANT

export default function PaperTradePage() {

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadTrades = async () => {
    try {
      setStatus("Loading...");
      const res = await axios.get(`${API}/paper-trades`);
      setTrades(res.data || []);
      setStatus("LIVE");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setStatus("Backend Offline");
      setLoading(false);
    }
  };

  const createTrades = async () => {
    try {
      setStatus("Creating...");
      await axios.post(`${API}/create-paper-trades`);
      await loadTrades();
      setStatus("Trades Created");
    } catch (err) {
      console.error(err);
      setStatus("Error creating trades");
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{
      padding: 20,
      maxWidth: 900,
      margin: "0 auto",
      background: "#f5f7fb",
      minHeight: "100vh"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <h1>🧾 Paper Trade Tracker</h1>

        <div style={{
          padding: "6px 10px",
          borderRadius: 6,
          background: status === "LIVE" ? "#198754" : "#6c757d",
          color: "white",
          fontSize: 12
        }}>
          {status}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={createTrades}
          style={{
            padding: "10px 14px",
            marginRight: 10,
            background: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Create Today's Paper Trades
        </button>

        <button
          onClick={loadTrades}
          style={{
            padding: "10px 14px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div style={{
        background: "white",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        Total Paper Trades: <b>{trades.length}</b>
      </div>

      {/* TRADES LIST */}
      {trades.length === 0 ? (
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: 8
        }}>
          No paper trades yet.
        </div>
      ) : (
        trades.map((t, i) => {

          const statusColor =
            t.status === "TARGET HIT" ? "#d4edda" :
            t.status === "STOP LOSS HIT" ? "#f8d7da" :
            "#fff3cd";

          return (
            <div key={i} style={{
              background: statusColor,
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8
            }}>
              <b>{t.stock}</b><br />
              Entry: ₹{t.entry}<br />
              🎯 Target: ₹{t.target}<br />
              🛑 Stop Loss: ₹{t.stop_loss}<br />
              Status: <b>{t.status}</b>
            </div>
          );
        })
      )}
    </div>
  );
}
