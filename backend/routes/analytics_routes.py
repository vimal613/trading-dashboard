from fastapi import APIRouter
from services.cache_service import scanner_cache

router = APIRouter()

# ------------------------------------------------
# EDGE SCORE
# ------------------------------------------------
@router.get("/edge-score")
def edge_score():

    stocks = scanner_cache.get("stocks", [])

    if len(stocks) == 0:
        return {
            "edge_score": 0,
            "win_rate": 0,
            "loss_rate": 0
        }

    aplus = len([s for s in stocks if s["rating"] == "A+"])
    a = len([s for s in stocks if s["rating"] == "A"])

    win_rate = min((aplus * 12 + a * 6), 75)
    loss_rate = max(30 - aplus * 3, 10)

    edge = max(win_rate - loss_rate, 0)

    return {
        "edge_score": round(edge, 1),
        "win_rate": round(win_rate, 1),
        "loss_rate": round(loss_rate, 1)
    }


# ------------------------------------------------
# PORTFOLIO BRAIN (1% DAILY GOAL PLANNER)
# ------------------------------------------------
@router.get("/portfolio-brain")
def portfolio_brain():

    stocks = scanner_cache.get("stocks", [])

    if len(stocks) == 0:
        return {
            "market_mode": "LOW OPPORTUNITY",
            "suggested_trades": "0 - 2",
            "goal_probability": "LOW",
            "message": "No strong setups. Capital protection mode."
        }

    aplus = len([s for s in stocks if s["rating"] == "A+"])
    avg_momentum = sum([s["momentum"] for s in stocks]) / len(stocks)

    strength = (aplus * 10) + (avg_momentum * 20)

    if strength > 80:
        mode = "HIGH OPPORTUNITY"
        trades = "8 - 12"
        probability = "HIGH"
        msg = "Strong market. Multiple setups available."

    elif strength > 40:
        mode = "NORMAL OPPORTUNITY"
        trades = "4 - 6"
        probability = "MEDIUM"
        msg = "Selective trading. Focus A+ signals."

    else:
        mode = "LOW OPPORTUNITY"
        trades = "0 - 3"
        probability = "LOW"
        msg = "Reduce trades. Protect capital."

    return {
        "market_mode": mode,
        "suggested_trades": trades,
        "goal_probability": probability,
        "message": msg
    }
