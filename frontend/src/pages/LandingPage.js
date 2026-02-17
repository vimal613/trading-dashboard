import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={{padding:20}}>
      <h1>📊 Trading Scanner Application</h1>

      <p>
        This app helps identify strong intraday stocks using momentum,
        volume and market strength analysis.
      </p>

      <h3>Advantages:</h3>
      <ul>
        <li>Find strong stocks automatically</li>
        <li>Reduce emotional trading</li>
        <li>Paper trading support</li>
      </ul>

      <Link to="/logic">Understand Scanner Logic →</Link>
    </div>
  );
}
