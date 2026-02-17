from datetime import datetime

def market_status():

    now = datetime.now()
    weekday = now.weekday()

    # weekend
    if weekday >= 5:
        return "CLOSED"

    minutes_now = now.hour * 60 + now.minute

    open_time = 9 * 60 + 15
    close_time = 15 * 60 + 30

    if open_time <= minutes_now <= close_time:
        return "OPEN"

    return "CLOSED"
