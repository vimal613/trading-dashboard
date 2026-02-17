import yfinance as yf

# ----------------------------------------
# LIQUID INDIAN STOCK UNIVERSE
# ----------------------------------------
STOCKS = [
    "RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ICICIBANK.NS",
    "SBIN.NS","AXISBANK.NS","KOTAKBANK.NS","LT.NS","ITC.NS",
    "HINDUNILVR.NS","BAJFINANCE.NS","BHARTIARTL.NS","ASIANPAINT.NS",
    "SUNPHARMA.NS","MARUTI.NS","TITAN.NS","ULTRACEMCO.NS",
    "WIPRO.NS","NTPC.NS","POWERGRID.NS","ADANIENT.NS","ONGC.NS",
    "POLYCAB.NS","PERSISTENT.NS","TRENT.NS","CUMMINSIND.NS",
    "COFORGE.NS","MPHASIS.NS","PIIND.NS","SRF.NS","LUPIN.NS",
    "AUBANK.NS","TORNTPHARM.NS","INDHOTEL.NS","CHOLAFIN.NS",
    "TVSMOTOR.NS","ABB.NS"
]

# ----------------------------------------
def safe(v):
    try:
        return float(v)
    except:
        return 0.0

# ----------------------------------------
def calculate_atr(df, period=14):
    high = df["High"]
    low = df["Low"]
    close = df["Close"]

    tr1 = high - low
    tr2 = (high - close.shift()).abs()
    tr3 = (low - close.shift()).abs()

    tr = tr1.combine(tr2, max).combine(tr3, max)
    atr = tr.rolling(period).mean()

    return safe(atr.iloc[-1])

# ----------------------------------------
def run_scanner():

    results = []

    for symbol in STOCKS:

        try:
            df = yf.download(
                symbol,
                period="3mo",
                interval="1d",
                progress=False
            )

            if df.empty or len(df) < 20:
                continue

            # safety handling (sometimes returns series)
            close = safe(df["Close"].iloc[-1])
            prev = safe(df["Close"].iloc[-2])

            if close <= 0 or prev <= 0:
                continue

            momentum = ((close / prev) - 1) * 100

            avg_vol = safe(df["Volume"].rolling(10).mean().iloc[-1])
            today_vol = safe(df["Volume"].iloc[-1])

            rel_volume = today_vol / avg_vol if avg_vol > 0 else 1

            sma5 = safe(df["Close"].rolling(5).mean().iloc[-1])
            sma10 = safe(df["Close"].rolling(10).mean().iloc[-1])

            atr = calculate_atr(df)
            atr_pct = (atr / close) * 100 if close > 0 else 0

            # --------------------------------
            # RELAXED STRICT FILTERS
            # --------------------------------
            if momentum < -0.2:
                continue

            if rel_volume < 0.9:
                continue

            if atr_pct < 0.4:
                continue

            # --------------------------------
            # SCORING
            # --------------------------------
            score = 0

            if momentum > 0:
                score += 20
            if momentum > 0.5:
                score += 20
            if momentum > 1:
                score += 15

            if rel_volume > 1.2:
                score += 15

            if close > sma5:
                score += 10

            if close > sma10:
                score += 10

            if atr_pct > 1:
                score += 10

            # --------------------------------
            # RATING
            # --------------------------------
            if score >= 70:
                rating = "A+"
            elif score >= 50:
                rating = "A"
            else:
                rating = "B"

            # --------------------------------
            # ATR BASED TARGET & STOP
            # --------------------------------
            target_move = atr * 0.25
            stop_move = atr * 0.18

            target_price = close + target_move
            stop_price = close - stop_move

            results.append({
                "stock": symbol,
                "price": round(close, 2),
                "momentum": round(momentum, 2),
                "rel_volume": round(rel_volume, 2),
                "atr_pct": round(atr_pct, 2),
                "score": score,
                "rating": rating,
                "target": round(target_price, 2),
                "stop_loss": round(stop_price, 2)
            })

        except Exception as e:
            print("scan error:", symbol, e)

    # sort strongest first
    results.sort(key=lambda x: x["score"], reverse=True)

    # always show top opportunities
    return {"stocks": results[:15]}
