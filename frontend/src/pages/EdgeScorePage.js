import { useEffect, useState } from "react";
import axios from "axios";

export default function EdgeScorePage() {

  const [edge, setEdge] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/edge-score")
      .then(res => setEdge(res.data));
  }, []);

  if (!edge) return <div style={{padding:20}}>Loading...</div>;

  let color = "#f8d7da";
  if (edge.edge_score >= 70) color = "#d4edda";
  else if (edge.edge_score >= 50) color = "#fff3cd";

  return (
    <div style={{padding:20}}>
      <h1>📈 Edge Score Dashboard</h1>

      <div style={{
        border:"1px solid #ccc",
        padding:15,
        background: color
      }}>
        <h2>Edge Score: {edge.edge_score}</h2>
        Win Rate: {edge.win_rate}%<br />
        Loss Rate: {edge.loss_rate}%<br />
        Total Trades: {edge.total_trades}
      </div>

      <br />

      <p>
        Interpretation:<br />
        70+ → Strong Edge<br />
        50–70 → Neutral<br />
        Below 50 → Weak edge (reduce risk)
      </p>
    </div>
  );
}
