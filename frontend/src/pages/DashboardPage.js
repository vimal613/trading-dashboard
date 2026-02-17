import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {

  const [data, setData] = useState(null);
  const [capital, setCapital] = useState(25000);
  const [mode, setMode] = useState("Balanced");

  // fetch scanner data
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/scan")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // rating weight
  const getWeight = (rating) => {
    if (rating === "A+") return 3;
    if (rating === "A") return 2;
    return 1;
  };

  // trade mode multiplier
  const getModeMultiplier = () => {
    if (mode === "Aggressive") return 1.0;
    if (mode === "Balanced") return 0.75;
    return 0.5; // Protected mode
  };

  if (!data) return <div style={{padding:20}}>Loading...</div>;

  const totalWeight = data.stocks.reduce(
    (sum, s) => sum + getWeight(s.rating), 0
  );

  return (
    <div style={{padding:20}}>

      <h1>📊 Live Scanner Dashboard</h1>

      {/* Capital Input */}
      <div style={{marginBottom:15}}>
        <label><b>Investment Amount (₹): </b></label>
        <input
          type="number"
          value={capital}
          onChange={(e)=>setCapital(Number(e.target.value))}
          style={{padding:6, marginLeft:10}}
        />
      </div>

      {/* Trade Mode */}
      <div style={{marginBottom:20}}>
        <label><b>Trade Mode: </b></label>
        <select
          value={mode}
          onChange={(e)=>setMode(e.target.value)}
          style={{padding:6, marginLeft:10}}
        >
          <option>Aggressive</option>
          <option>Balanced</option>
          <option>Protected</option>
        </select>
      </div>

      {/* Stock Cards */}
      {data.stocks.map((s,i)=>{

        const baseAlloc =
          (capital * getWeight(s.rating)) / totalWeight;

        const allocation =
          Math.round(baseAlloc * getModeMultiplier());

        const qty = Math.floor(allocation / s.price);

        return (
          <div key={i} style={{
            border:"1px solid #ccc",
            padding:12,
            marginBottom:12,
            background:"#fff",
            borderRadius:6
          }}>
            <b>{s.stock}</b><br />

            Rating: {s.rating}<br />
            Score: {s.score}<br />
            Momentum: {s.momentum}%<br />
            Price: ₹{s.price}<br />

            Target: ₹{s.target}<br />
            Stop Loss: ₹{s.stop_loss}<br />

            <hr />

            Allocation: ₹{allocation}<br />
            Quantity: {qty}
          </div>
        );
      })}
    </div>
  );
}
