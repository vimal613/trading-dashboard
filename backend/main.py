from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.scanner_routes import router as scanner_router
from routes.trade_routes import router as trade_router
from routes.analytics_routes import router as analytics_router

from services.cache_service import start_scheduler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(scanner_router)
app.include_router(trade_router)
app.include_router(analytics_router)


# -----------------------------------
# START BACKGROUND CACHE ON STARTUP
# -----------------------------------
@app.on_event("startup")
def startup_event():
    start_scheduler()
