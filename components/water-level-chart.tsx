"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Calendar, TrendingDown, TrendingUp, AlertCircle } from "lucide-react"

interface WaterLevelData {
  timestamp: string
  level: number
  forecast?: number
  confidence?: number
}

interface WaterLevelChartProps {
  stationId: string
  stationName: string
  data: WaterLevelData[]
  timeRange: "24h" | "7d" | "30d"
  onTimeRangeChange: (range: "24h" | "7d" | "30d") => void
}

export function WaterLevelChart({ stationId, stationName, data, timeRange, onTimeRangeChange }: WaterLevelChartProps) {
  const [showForecast, setShowForecast] = useState(true)

  // Generate sample data if none provided
  const sampleData: WaterLevelData[] = [
    { timestamp: "2024-01-08", level: 12.5 },
    { timestamp: "2024-01-09", level: 12.3 },
    { timestamp: "2024-01-10", level: 12.1 },
    { timestamp: "2024-01-11", level: 11.9 },
    { timestamp: "2024-01-12", level: 12.0 },
    { timestamp: "2024-01-13", level: 12.2 },
    { timestamp: "2024-01-14", level: 12.4 },
    { timestamp: "2024-01-15", level: 12.5 },
    { timestamp: "2024-01-16", level: 12.3, forecast: 12.3, confidence: 95 },
    { timestamp: "2024-01-17", level: 12.1, forecast: 12.1, confidence: 92 },
    { timestamp: "2024-01-18", level: 11.8, forecast: 11.9, confidence: 88 },
    { timestamp: "2024-01-19", level: 11.6, forecast: 11.7, confidence: 85 },
    { timestamp: "2024-01-20", level: 11.4, forecast: 11.5, confidence: 82 },
  ]

  const chartData = data.length > 0 ? data : sampleData

  const currentLevel = chartData[chartData.length - 1]?.level || 0
  const previousLevel = chartData[chartData.length - 2]?.level || 0
  const trend = currentLevel - previousLevel
  const trendPercentage = ((trend / previousLevel) * 100).toFixed(1)

  const formatTooltip = (value: any, name: string) => {
    if (name === "level") return [`${value}m`, "Water Level"]
    if (name === "forecast") return [`${value}m`, "AI Forecast"]
    return [value, name]
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    if (timeRange === "24h") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{stationName}</CardTitle>
            <p className="text-sm text-muted-foreground">Water Level Monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Calendar className="h-3 w-3 mr-1" />
              {timeRange}
            </Badge>
          </div>
        </div>

        {/* Current Status */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{currentLevel}m</span>
            <div className={`flex items-center gap-1 ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-sm font-medium">{trendPercentage}%</span>
            </div>
          </div>

          {currentLevel < 5 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Critical Level
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Time Range Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {(["24h", "7d", "30d"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeRangeChange(range)}
              >
                {range}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowForecast(!showForecast)}>
            {showForecast ? "Hide" : "Show"} Forecast
          </Button>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}m`} />
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                contentStyle={{
                  backgroundColor: "#374151",
                  border: "1px solid #6b7280",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />

              <Area type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={2} fill="url(#levelGradient)" />

              {showForecast && (
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#forecastGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-muted-foreground">Actual Level</span>
          </div>
          {showForecast && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded" />
              <span className="text-muted-foreground">AI Forecast</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
