import { useEffect, useState, useRef } from "react";
import axios from "axios";
import API from "../api";   // IMPORTANT

export default function ScannerLogsPage() {

  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("Connecting...");
  const logEndRef = useRef(null);

  const loadLogs = async () => {
    try {
      const res = await axios.get(`${API}/scanner-logs`);
      setLogs(res.data || []);
      setStatus("LIVE");
    } catch (err) {
      console.error(err);
      setStatus("BACKEND OFFLINE");
      setLogs(["Unable to load logs..."]);
    }
  };

  useEffect(() => {
    loadLogs();

    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // auto-scroll to latest log
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div style={{
      padding: 20,
      background: "#0b0f14",
      color: "#00ff88",
      minHeight: "100vh",
      fontFamily: "monospace"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <h2 style={{ color: "white", margin: 0 }}>
          🖥 Live Scanner Logs
        </h2>

        <div style={{
          background: status === "LIVE" ? "#1b5e20" : "#8b0000",
          padding: "6px 10px",
          borderRadius: 6,
          color: "white",
          fontSize: 12
        }}>
          {status}
        </div>
      </div>

      {/* LOG CONTAINER */}
      <div style={{
        background: "#111",
        padding: 15,
        borderRadius: 8,
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #333",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
      }}>

        {logs.length === 0 ? (
          <div style={{ color: "#888" }}>No logs yet...</div>
        ) : (
          logs.map((line, i) => (
            <div key={i} style={{
              marginBottom: 4,
              whiteSpace: "pre-wrap"
            }}>
              {line}
            </div>
          ))
        )}

        <div ref={logEndRef}></div>
      </div>

      {/* FOOTER INFO */}
      <div style={{
        marginTop: 12,
        fontSize: 12,
        color: "#777"
      }}>
        Auto-refresh every 5 seconds • Prop Desk Mode
      </div>

    </div>
  );
}
