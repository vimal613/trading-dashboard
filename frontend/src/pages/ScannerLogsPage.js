import { useEffect, useState } from "react";
import axios from "axios";

export default function ScannerLogsPage() {

  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    axios
      .get("http://127.0.0.1:8000/scanner-logs")
      .then(res => setLogs(res.data))
      .catch(() => setLogs(["Unable to load logs..."]));
  };

  useEffect(() => {
    loadLogs();

    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding:20,
      background:"#0b0f14",
      color:"#00ff88",
      minHeight:"100vh",
      fontFamily:"monospace"
    }}>
      <h2 style={{color:"white"}}>🖥 Live Scanner Logs</h2>

      <div style={{
        background:"#111",
        padding:15,
        borderRadius:8,
        maxHeight:"80vh",
        overflowY:"auto",
        border:"1px solid #333"
      }}>
        {logs.length === 0 ? (
          <div>No logs yet...</div>
        ) : (
          logs.map((line, i) => (
            <div key={i} style={{marginBottom:4}}>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
