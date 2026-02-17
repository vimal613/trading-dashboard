from fastapi import APIRouter
import json
import os
from datetime import date
from services.cache_service import scanner_cache

router = APIRouter()

DATA_FILE = "data/paper_trades.json"


# ---------------- CREATE PAPER TRADES ----------------
@router.post("/create-paper-trades")
def create_paper_trades():

    stocks = scanner_cache.get("stocks", [])

    if len(stocks) == 0:
        return {"message": "No stocks available", "count": 0}

    today = str(date.today())

    trades = []

    for s in stocks[:5]:
        trades.append({
            "date": today,
            "stock": s["stock"],
            "entry": s["price"],
            "target": s["target"],
            "stop_loss": s["stop_loss"],
            "rating": s["rating"],
            "status": "OPEN"
        })

    existing = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            existing = json.load(f)

    with open(DATA_FILE, "w") as f:
        json.dump(existing + trades, f, indent=2)

    return {"message": "Paper trades created", "count": len(trades)}


# ---------------- GET PAPER TRADES ----------------
@router.get("/paper-trades")
def get_paper_trades():

    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r") as f:
        return json.load(f)
