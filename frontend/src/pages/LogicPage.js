import { Link } from "react-router-dom";

export default function LogicPage() {
  return (
    <div style={{padding:20}}>
      <h1>🧠 Scanner Logic</h1>

      <ul>
        <li>Momentum detection</li>
        <li>Volume participation</li>
        <li>Market regime analysis</li>
      </ul>

      <Link to="/dashboard">Go to Live Dashboard →</Link>
    </div>
  );
}
