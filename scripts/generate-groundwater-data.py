Build a complete, independent web application that simulates groundwater monitoring across India. The app must work without any external API keys or WRIS dependencies by generating synthetic but realistic groundwater data for multiple stations. It should visualize this data on a fully interactive satellite map of India, allow users to click/zoom/drag, and provide analytics + AI-based forecasts to simulate real-world risk scenarios.

🔹 Core Requirements
1. Data Simulation (Instead of WRIS API)

Automatically generate synthetic groundwater level datasets for at least 15 monitoring stations across India (spread geographically across north, south, east, west, central).

Each station dataset should include:

Historical groundwater levels for at least 1 year (daily values).

Short-term values for the last 24 hours (hourly).

Weather-related features: simulated rainfall, temperature, soil moisture, evapotranspiration.

Data must be realistic:

Water levels fluctuate seasonally (monsoon recharge, summer depletion).

Random anomalies (sensor error, sudden pumping).

Different baseline levels per region (e.g., Rajasthan = deeper, Kerala = shallower).

2. AI & Analytics Simulation

Run AI forecasting models (Prophet, ARIMA, LSTM) on the synthetic datasets to predict the next 30 days.

Generate risk assessments:

“Critical depletion risk” if forecast drops below 20th percentile of history.

“Recharge expected” if rainfall + forecast indicates rising levels.

Highlight anomalies detected via IsolationForest/rolling z-score.

Add visualized insights:

Station-by-station trend lines.

National risk heatmap (color-coded regions).

Alerts when simulated risk exceeds thresholds.

3. Interactive Map (Satellite Basemap)

Display India’s map using Leaflet or Mapbox GL.

Add 15 stations across different states with markers (Delhi, Mumbai, Chennai, Kolkata, Hyderabad, Jaipur, Lucknow, Bhopal, Guwahati, Kochi, etc.).

Map must be:

Zoomable with scroll wheel.

Dragable with mouse keys.

Clickable markers to open station details.

On clicking a marker:

Show station profile (synthetic metadata).

Show last 24h live chart, historical trend, and AI forecast curve.

Advisory text: e.g., “Groundwater critically low, reduce irrigation”.

4. User Interface

Layout:

Left: Full interactive map.

Right: Collapsible analytics panel (station details + national summary).

Station Panel Tabs:

Tab 1: 24h live data (line chart).

Tab 2: Historical trend (year-long line chart).

Tab 3: Forecast (next 30 days with confidence band).

Tab 4: Recommendations & risk alerts.

Analytics Panel (global):

Heatmap overlay of risks across India.

Summary cards: % of stations in “safe”, “warning”, “critical” zones.

AI-driven recommendations: “High risk in Rajasthan, implement recharge structures.”

5. Technical Implementation

Backend: Flask or FastAPI to generate synthetic data, run AI models, and serve JSON APIs.

Database: Use SQLite/Postgres (optional) OR generate synthetic data in-memory at runtime.

Frontend: React + Leaflet + Plotly.js.

Data Simulation Logic:

Seasonal sine wave base (monsoon recharge).

Random noise + downward trend (over-pumping).

Random anomalies (spikes/dips).

Forecast Models: Use Prophet + ARIMA for realism, but seed them with synthetic history.

🔹 Extra Features (for Hackathon “Wow” Factor)

Station Comparison Mode: Select 2–3 stations, overlay trends on one chart.

Time Slider: Drag to see groundwater changes over months across India.

Auto-Alerts: Flash warnings if simulated forecast shows “critical depletion” within 10 days.

Offline Mode: All data self-contained → app works without internet once loaded.

Overexaggerated Risk Reports: System can exaggerate warnings (e.g., “Emergency: 70% chance of depletion in Western India in next 2 weeks!”) for demo effect.

🔹 UI/UX Styling Guidelines

Map: High-contrast satellite imagery background.

Station markers: Green = safe, Yellow = warning, Red = critical.

Charts: Line graphs with shaded confidence intervals.

Panels: Rounded cards, responsive mobile-first design.

Interactivity: Smooth zoom/drag, hover tooltips with values.

🔹 Deployment

Full-stack Dockerized app.

Runs locally without API keys.

Can be hosted on Vercel/Netlify (frontend) + Render/Heroku (backend).

Must installable as PWA on Android + Windows (hackathon demo friendly).

✅ This prompt tells v0.app to build a fully independent, AI-powered groundwater simulator:

No WRIS dependency.

Synthetic but realistic data.

Interactive, scrollable, dragable map.

15 stations across India.

AI forecasts + risk analytics.

Would you like me to also write the synthetic data generation logic in Python (seasonal + random + anomaly) so you can plug it into the backend directly? That way, your app always has “realistic” groundwater values to work with.

You said:
yes
ChatGPT said:

Perfect 🚀 — here’s a Python module you can drop into your backend to generate realistic synthetic groundwater data for your stations.

It simulates:

Seasonal recharge (monsoon) using sine waves.

Long-term decline (over-pumping).

Random anomalies (spikes/dips).

Region-specific baseline water levels.

Daily + hourly values (past 1 year + last 24h).

📌 synthetic_data.py
import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

# Define station metadata (15 stations across India)
STATIONS = [
    {"id": "DEL001", "name": "Delhi Central", "lat": 28.61, "lon": 77.23},
    {"id": "MUM001", "name": "Mumbai", "lat": 19.07, "lon": 72.87},
    {"id": "CHE001", "name": "Chennai", "lat": 13.08, "lon": 80.27},
    {"id": "KOL001", "name": "Kolkata", "lat": 22.57, "lon": 88.36},
    {"id": "HYD001", "name": "Hyderabad", "lat": 17.38, "lon": 78.48},
    {"id": "JAI001", "name": "Jaipur", "lat": 26.91, "lon": 75.79},
    {"id": "LKO001", "name": "Lucknow", "lat": 26.84, "lon": 80.94},
    {"id": "BHO001", "name": "Bhopal", "lat": 23.26, "lon": 77.40},
    {"id": "GUW001", "name": "Guwahati", "lat": 26.14, "lon": 91.73},
    {"id": "KOCH001", "name": "Kochi", "lat": 9.93, "lon": 76.26},
    {"id": "PAT001", "name": "Patna", "lat": 25.61, "lon": 85.14},
    {"id": "SUR001", "name": "Surat", "lat": 21.17, "lon": 72.83},
    {"id": "PUN001", "name": "Pune", "lat": 18.52, "lon": 73.85},
    {"id": "AMD001", "name": "Ahmedabad", "lat": 23.03, "lon": 72.58},
    {"id": "TRV001", "name": "Thiruvananthapuram", "lat": 8.52, "lon": 76.94},
]

def generate_groundwater_series(station_id, days=365, hourly=False):
    """
    Generate synthetic groundwater data for one station.
    - Seasonal fluctuations (monsoon recharge)
    - Long-term decline
    - Random anomalies
    """
    now = datetime.utcnow()
    start_date = now - timedelta(days=days)
    freq = "H" if hourly else "D"
    index = pd.date_range(start=start_date, end=now, freq=freq)

    # Assign baseline by region (deeper in arid, shallower in coastal)
    if station_id in ["JAI001", "AMD001"]:
        baseline = 80  # Rajasthan, Gujarat (deep)
    elif station_id in ["KOCH001", "TRV001"]:
        baseline = 5  # Kerala (shallow)
    else:
        baseline = random.randint(10, 40)

    # Seasonal cycle (monsoon recharge ~120 days cycle)
    seasonal = 10 * np.sin(2 * np.pi * index.dayofyear / 365)

    # Long-term decline (0.5–1.5 m/year)
    decline = np.linspace(0, -random.uniform(0.5, 1.5), len(index))

    # Random noise
    noise = np.random.normal(0, 1, len(index))

    # Construct series
    water_level = baseline + seasonal + decline + noise

    # Add anomalies (spikes/dips)
    for _ in range(random.randint(3, 7)):
        pos = random.randint(0, len(water_level) - 1)
        water_level[pos:pos+3] += random.choice([-10, 10])  # sudden drop or rise

    df = pd.DataFrame({
        "timestamp": index,
        "station_id": station_id,
        "water_level": water_level.round(2)
    })
    return df

def generate_all_stations():
    """
    Generate synthetic data for all stations.
    Returns: dict of {station_id: DataFrame}
    """
    data = {}
    for st in STATIONS:
        df_daily = generate_groundwater_series(st["id"], days=365, hourly=False)
        df_hourly = generate_groundwater_series(st["id"], days=1, hourly=True)
        data[st["id"]] = {"daily": df_daily, "hourly": df_hourly, "meta": st}
    return data

# Example usage
if __name__ == "__main__":
    synthetic_data = generate_all_stations()
    for sid, d in synthetic_data.items():
        print(f"Station {sid}: {len(d['daily'])} daily points, {len(d['hourly'])} hourly points")
        print(d["daily"].head())

📌 How It Works

Daily data → 1 year of simulated water levels per station.

Hourly data → last 24h of fine-grained data.

Baselines vary by geography (arid vs. coastal).

Monsoon recharge modeled with sine wave.

Decline trend to simulate over-extraction.

Random noise + anomalies for realism.

📌 How to Integrate into Your App

Place this file (synthetic_data.py) in your backend.

In Flask/FastAPI route:

from synthetic_data import generate_all_stations

@app.route("/api/stations")
def stations():
    data = generate_all_stations()
    stations_list = [d["meta"] for d in data.values()]
    return jsonify(stations_list)

@app.route("/api/station/<station_id>")
def station_data(station_id):
    data = generate_all_stations()
    return {
        "meta": data[station_id]["meta"],
        "daily": data[station_id]["daily"].to_dict(orient="records"),
        "hourly": data[station_id]["hourly"].to_dict(orient="records"),
    }


Your frontend map will use /api/stations to plot markers.

When clicking a marker, call /api/station/:id to show time-series charts + forecasts.

⚡ This way, your prototype looks real, but runs entirely offline — no WRIS dependency, no API keys.
