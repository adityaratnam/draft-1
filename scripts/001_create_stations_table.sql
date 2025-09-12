-- Create groundwater monitoring stations table
CREATE TABLE IF NOT EXISTS public.groundwater_stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  depth_meters DECIMAL(8, 2) NOT NULL,
  water_level_meters DECIMAL(8, 2) NOT NULL,
  quality_index INTEGER NOT NULL CHECK (quality_index >= 0 AND quality_index <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  annual_rainfall_mm DECIMAL(8, 2) NOT NULL,
  temperature_celsius DECIMAL(5, 2) NOT NULL,
  ph_level DECIMAL(4, 2) NOT NULL,
  tds_ppm INTEGER NOT NULL,
  is_critical BOOLEAN DEFAULT FALSE,
  resolution_suggestions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create historical data table for time series
CREATE TABLE IF NOT EXISTS public.groundwater_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id TEXT NOT NULL REFERENCES public.groundwater_stations(id) ON DELETE CASCADE,
  water_level_meters DECIMAL(8, 2) NOT NULL,
  quality_index INTEGER NOT NULL,
  temperature_celsius DECIMAL(5, 2) NOT NULL,
  ph_level DECIMAL(4, 2) NOT NULL,
  tds_ppm INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stations_state ON public.groundwater_stations(state);
CREATE INDEX IF NOT EXISTS idx_stations_risk_level ON public.groundwater_stations(risk_level);
CREATE INDEX IF NOT EXISTS idx_stations_critical ON public.groundwater_stations(is_critical);
CREATE INDEX IF NOT EXISTS idx_readings_station_id ON public.groundwater_readings(station_id);
CREATE INDEX IF NOT EXISTS idx_readings_recorded_at ON public.groundwater_readings(recorded_at);

-- Enable Row Level Security (RLS) - for public read access
ALTER TABLE public.groundwater_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groundwater_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required for this monitoring system)
CREATE POLICY "Allow public read access to stations" ON public.groundwater_stations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to readings" ON public.groundwater_readings FOR SELECT USING (true);
