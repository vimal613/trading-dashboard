from fastapi import APIRouter
from services.cache_service import scanner_cache, scanner_logs

router = APIRouter()


# ---------------- SCAN ----------------
@router.get("/scan")
def scan():
    return {
        "market_status": scanner_cache["market_status"],
        "reason": scanner_cache["reason"],
        "last_update": scanner_cache["last_update"],
        "stocks": scanner_cache["stocks"]
    }


# ---------------- POWER METER ----------------
@router.get("/power-meter")
def power_meter():

    stocks = scanner_cache["stocks"]

    if len(stocks) == 0:
        return {
            "power":0,
            "zone":"WEAK",
            "avg_momentum":0,
            "aplus_count":0,
            "a_count":0
        }

    aplus = len([s for s in stocks if s["rating"]=="A+"])
    a = len([s for s in stocks if s["rating"]=="A"])

    avg = sum([s["momentum"] for s in stocks]) / len(stocks)

    power = min(max(((aplus*3)+(a*2))/(len(stocks)*3)*100,0),100)

    zone = "STRONG" if power>=70 else "NEUTRAL" if power>=40 else "WEAK"

    return {
        "power": round(power,1),
        "zone": zone,
        "avg_momentum": round(avg,2),
        "aplus_count": aplus,
        "a_count": a
    }


# ---------------- MORNING BRIEF ----------------
@router.get("/morning-briefing")
def morning_briefing():

    stocks = scanner_cache["stocks"]
    total = len(stocks)

    aplus = len([s for s in stocks if s["rating"]=="A+"])
    a = len([s for s in stocks if s["rating"]=="A"])

    strength = 0
    if total > 0:
        strength = round(((aplus*3)+(a*2))/(total*3)*100)

    signal = "GO" if strength >= 50 else "NO-GO"

    return {
        "market_strength": strength,
        "signal": signal,
        "advice": "Focus on A+ setups." if signal=="GO" else "Low probability day."
    }


# ---------------- LIVE LOGS ----------------
@router.get("/scanner-logs")
def scanner_logs_api():
    return scanner_logs
