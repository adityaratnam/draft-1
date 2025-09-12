"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Zap, Target } from "lucide-react"
import { aiForecasting, type ForecastResult, getForecastTrend, getRiskLevel } from "@/lib/ai-forecasting"
import type { GroundwaterDataPoint } from "@/lib/synthetic-data"

interface AIForecastPanelProps {
  stationId: string
  stationName: string
  historicalData: GroundwaterDataPoint[]
  className?: string
}

export function AIForecastPanel({ stationId, stationName, historicalData, className }: AIForecastPanelProps) {
  const [forecast, setForecast] = useState<ForecastResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [forecastDays, setForecastDays] = useState(7)

  const generateForecast = async () => {
    if (!stationId || historicalData.length === 0) return

    setLoading(true)
    try {
      const result = await aiForecasting.generateForecast(stationId, historicalData, forecastDays)
      setForecast(result)
    } catch (error) {
      console.error("Forecast generation error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (stationId && historicalData.length > 0) {
      generateForecast()
    }
  }, [stationId, historicalData, forecastDays])

  const chartData = forecast
    ? [
        ...historicalData.slice(-7).map((d) => ({
          date: new Date(d.dateTime).toLocaleDateString(),
          actual: d.waterLevel,
          type: "historical",
        })),
        ...forecast.forecast.map((f) => ({
          date: new Date(f.timestamp).toLocaleDateString(),
          predicted: f.predictedLevel,
          upperBound: f.upperBound,
          lowerBound: f.lowerBound,
          confidence: f.confidence,
          type: "forecast",
        })),
      ]
    : []

  const trend = forecast ? getForecastTrend(forecast.forecast) : "stable"
  const riskLevel = forecast ? getRiskLevel(forecast.forecast) : "low"

  const getTrendIcon = () => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Target className="h-4 w-4 text-blue-400" />
    }
  }

  const getRiskColor = () => {
    switch (riskLevel) {
      case "high":
        return "text-red-400 border-red-400"
      case "medium":
        return "text-yellow-400 border-yellow-400"
      default:
        return "text-green-400 border-green-400"
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Forecast Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Forecast - {stationName}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={generateForecast} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            {[7, 14, 30].map((days) => (
              <Button
                key={days}
                size="sm"
                variant={forecastDays === days ? "default" : "outline"}
                onClick={() => setForecastDays(days)}
              >
                {days}d
              </Button>
            ))}
          </div>

          {forecast && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getTrendIcon()}
                  <span className="text-sm font-medium text-foreground">
                    {trend.charAt(0).toUpperCase() + trend.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Trend</p>
              </div>

              <div className="text-center">
                <Badge variant="outline" className={`${getRiskColor()} mb-1`}>
                  {riskLevel.toUpperCase()} RISK
                </Badge>
                <p className="text-xs text-muted-foreground">Risk Level</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forecast Chart */}
      {forecast && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Prediction Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(value) => `${value}m`} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "actual") return [`${value}m`, "Actual Level"]
                      if (name === "predicted") return [`${value}m`, "Predicted Level"]
                      if (name === "upperBound") return [`${value}m`, "Upper Bound"]
                      if (name === "lowerBound") return [`${value}m`, "Lower Bound"]
                      return [value, name]
                    }}
                    contentStyle={{
                      backgroundColor: "#374151",
                      border: "1px solid #6b7280",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />

                  {/* Confidence interval */}
                  <Area type="monotone" dataKey="upperBound" stroke="none" fill="url(#confidenceGradient)" />
                  <Area type="monotone" dataKey="lowerBound" stroke="none" fill="#1f2937" />

                  {/* Actual data line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />

                  {/* Predicted data line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500" />
                <span className="text-muted-foreground">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-500 border-dashed" />
                <span className="text-muted-foreground">AI Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-purple-500/20" />
                <span className="text-muted-foreground">Confidence</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Performance */}
      {forecast && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Model</span>
                <Badge variant="outline" className="text-xs">
                  {forecast.model}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Accuracy</span>
                <span className="text-xs font-medium text-foreground">{forecast.accuracy}%</span>
              </div>
              <Progress value={forecast.accuracy} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Avg Confidence</span>
                <span className="text-xs font-medium text-foreground">
                  {Math.round(forecast.forecast.reduce((sum, f) => sum + f.confidence, 0) / forecast.forecast.length)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {forecast && forecast.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {forecast.recommendations.map((rec, index) => {
              const isWarning = rec.toLowerCase().includes("critical") || rec.toLowerCase().includes("warning")
              const isPositive = rec.toLowerCase().includes("positive") || rec.toLowerCase().includes("safe")

              return (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    isWarning
                      ? "bg-red-500/10 border-red-500/20"
                      : isPositive
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-blue-500/10 border-blue-500/20"
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      isWarning ? "text-red-400" : isPositive ? "text-green-400" : "text-blue-400"
                    }`}
                  >
                    {rec}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">Generating AI forecast...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
