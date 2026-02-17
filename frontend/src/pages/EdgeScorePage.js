import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";   // IMPORTANT

export default function EdgeScorePage() {

  const [edge, setEdge] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState("");

  const loadEdge = async () => {
    try {
      const res = await axios.get(`${API}/edge-score`);
      setEdge(res.data);
      setStatus("LIVE");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend.");
      setStatus("OFFLINE");
    }
  };

  useEffect(() => {
    loadEdge();
  }, []);

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  if (!edge) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // COLOR ZONE
  let color = "#f8d7da";
  let label = "WEAK EDGE";

  if (edge.edge_score >= 70) {
    color = "#d4edda";
    label = "STRONG EDGE";
  } else if (edge.edge_score >= 50) {
    color = "#fff3cd";
    label = "NEUTRAL EDGE";
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
        <h1>📈 Edge Score Dashboard</h1>

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

      {/* EDGE CARD */}
      <div style={{
        background: color,
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: 20
      }}>
        <h2 style={{ marginTop: 0 }}>
          Edge Score: {edge.edge_score}
        </h2>

        <b>{label}</b><br /><br />

        Win Rate: <b>{edge.win_rate}%</b><br />
        Loss Rate: <b>{edge.loss_rate}%</b><br />
        Total Trades: <b>{edge.total_trades || 0}</b>
      </div>

      {/* EXPLANATION */}
      <div style={{
        background: "white",
        padding: 16,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <h3>📘 Interpretation</h3>

        70+ → Strong edge (normal risk allowed)<br />
        50–70 → Neutral edge (trade selectively)<br />
        Below 50 → Weak edge (reduce position size)
      </div>
    </div>
  );
}
