import { Link } from "react-router-dom";

export default function Navbar() {

  const style = {
    padding:"10px 15px",
    color:"white",
    textDecoration:"none"
  };

  return (
    <div style={{
      background:"#111",
      padding:10,
      display:"flex",
      gap:10
    }}>
      <Link to="/" style={style}>Master</Link>
      <Link to="/dashboard" style={style}>Scanner</Link>
      <Link to="/paper-trades" style={style}>Paper Trades</Link>
      <Link to="/replay" style={style}>Replay</Link>
      <Link to="/edge" style={style}>Edge Score</Link>
      <Link to="/logs" style={style}>Logs</Link>
    </div>
  );
}
