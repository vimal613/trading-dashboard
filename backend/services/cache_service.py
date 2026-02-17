from apscheduler.schedulers.background import BackgroundScheduler
from services.scanner import run_scanner
from services.market_utils import market_status
from datetime import datetime

# -----------------------------------
# GLOBAL CACHE
# -----------------------------------
scanner_cache = {
    "market_status": "UNKNOWN",
    "reason": "",
    "stocks": [],
    "last_update": None,
    "last_log": ""
}

# -----------------------------------
# LIVE LOG BUFFER
# -----------------------------------
scanner_logs = []


def add_log(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    line = f"[{timestamp}] {message}"
    scanner_logs.append(line)

    # keep only latest 100 logs
    if len(scanner_logs) > 100:
        scanner_logs.pop(0)

    print(line)


# -----------------------------------
# BACKGROUND SCAN JOB
# -----------------------------------
def update_scanner_cache():

    status = market_status()

    if status == "CLOSED":
        scanner_cache["market_status"] = "CLOSED"
        scanner_cache["reason"] = "Market is closed."
        scanner_cache["stocks"] = []
        scanner_cache["last_update"] = datetime.now().strftime("%H:%M:%S")

        add_log("Market closed — scanner skipped.")
        return

    add_log("Scanning market...")

    data = run_scanner()

    scanner_cache["market_status"] = "OPEN"
    scanner_cache["stocks"] = data["stocks"]
    scanner_cache["last_update"] = datetime.now().strftime("%H:%M:%S")

    if len(data["stocks"]) == 0:
        scanner_cache["reason"] = "No setups found (strict mode)."
        add_log("Scan complete — no setups.")
    else:
        scanner_cache["reason"] = ""
        add_log(f"Scan complete — {len(data['stocks'])} stocks ranked.")


# -----------------------------------
# START LIVE ENGINE
# -----------------------------------
def start_scheduler():

    scheduler = BackgroundScheduler()

    # LIVE mode — every 60 sec
    scheduler.add_job(
        update_scanner_cache,
        "interval",
        seconds=60
    )

    scheduler.start()

    # first run immediately
    update_scanner_cache()

    add_log("Live intraday engine started.")
