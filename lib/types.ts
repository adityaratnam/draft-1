export interface GroundwaterStation {
  id: string
  name: string
  location: string
  state: string
  district: string
  latitude: number
  longitude: number
  depth_meters: number
  water_level_meters: number
  quality_index: number
  risk_level: "Low" | "Medium" | "High" | "Critical"
  last_updated: string
  annual_rainfall_mm: number
  temperature_celsius: number
  ph_level: number
  tds_ppm: number
  is_critical: boolean
  resolution_suggestions: string[]
  created_at: string
}

export interface GroundwaterReading {
  id: string
  station_id: string
  water_level_meters: number
  quality_index: number
  temperature_celsius: number
  ph_level: number
  tds_ppm: number
  recorded_at: string
  created_at: string
}

export interface GroundwaterDataPoint {
  id: string
  location: string
  waterLevel: number
  quality: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  lastUpdated: string
  coordinates: [number, number]
  depth: number
  temperature: number
  pH: number
  tds: number
  rainfall: number
  isCritical: boolean
  resolutionSuggestions: string[]
}

export interface ForecastData {
  date: string
  predicted: number
  confidence: number
  trend: "increasing" | "decreasing" | "stable"
}

export interface AIForecast {
  stationId: string
  forecast: ForecastData[]
  recommendations: string[]
  confidence: number
  riskAssessment: string
}
