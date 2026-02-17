import { useEffect, useState } from "react";
import axios from "axios";

export default function MorningBriefingPage() {

  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/morning-briefing")
      .then(res => setBriefing(res.data));
  }, []);

  if (!briefing) return <div style={{padding:20}}>Loading...</div>;

  const bg = briefing.signal === "GO" ? "#d4edda" : "#f8d7da";

  return (
    <div style={{padding:20}}>
      <h1>🌅 Morning Briefing</h1>

      <div style={{
        border:"1px solid #ccc",
        padding:15,
        background:bg
      }}>
        <b>Market Strength:</b> {briefing.market_strength}%<br />
        <b>A+ Stocks:</b> {briefing.aplus_count}<br />
        <b>A Stocks:</b> {briefing.a_count}<br />
        <b>Signal:</b> {briefing.signal}<br />
        <br />
        <b>Advice:</b> {briefing.advice}
      </div>
    </div>
  );
}
