import { useState } from "react";
import axios from "axios";

export default function HistoricalReplayPage() {

  const [selectedDate, setSelectedDate] = useState("");
  const [trades, setTrades] = useState([]);

  const loadReplay = () => {
    if (!selectedDate) return;

    axios.get(`http://127.0.0.1:8000/replay/${selectedDate}`)
      .then(res => setTrades(res.data));
  };

  return (
    <div style={{padding:20}}>

      <h1>🕰️ Historical Replay</h1>

      <div style={{marginBottom:20}}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e)=>setSelectedDate(e.target.value)}
          style={{padding:6}}
        />

        <button
          onClick={loadReplay}
          style={{
            marginLeft:10,
            padding:8,
            background:"blue",
            color:"white",
            border:"none"
          }}
        >
          Load Day
        </button>
      </div>

      {trades.length === 0 && (
        <p>No trades for selected date.</p>
      )}

      {trades.map((t,i)=>(
        <div key={i} style={{
          border:"1px solid #ccc",
          padding:10,
          marginBottom:10
        }}>
          <b>{t.stock}</b><br />
          Date: {t.date}<br />
          Entry: ₹{t.entry}<br />
          Target: ₹{t.target}<br />
          Stop Loss: ₹{t.stop_loss}<br />
          Status: {t.status}
        </div>
      ))}

    </div>
  );
}
