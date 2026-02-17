import { useEffect, useState } from "react";
import axios from "axios";

export default function PaperTradePage() {

  const [trades, setTrades] = useState([]);

  const loadTrades = () => {
    axios.get("http://127.0.0.1:8000/paper-trades")
      .then(res => setTrades(res.data))
      .catch(err => console.log(err));
  };

  const createTrades = () => {
    axios.post("http://127.0.0.1:8000/create-paper-trades")
      .then(() => loadTrades())
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadTrades();
  }, []);

  return (
    <div style={{padding:20}}>

      <h1>🧾 Paper Trade Tracker</h1>

      <button
        onClick={createTrades}
        style={{
          padding:"10px 14px",
          marginBottom:20,
          background:"#0d6efd",
          color:"white",
          border:"none",
          borderRadius:6
        }}
      >
        Create Today's Paper Trades
      </button>

      {trades.length === 0 ? (
        <div>No paper trades yet.</div>
      ) : (
        trades.map((t,i)=>(
          <div key={i} style={{
            border:"1px solid #ddd",
            padding:10,
            marginBottom:10,
            borderRadius:8
          }}>
            <b>{t.stock}</b><br/>
            Entry: ₹{t.entry}<br/>
            Target: ₹{t.target}<br/>
            Stop Loss: ₹{t.stop_loss}<br/>
            Status: {t.status}
          </div>
        ))
      )}
    </div>
  );
}
