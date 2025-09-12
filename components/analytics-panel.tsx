"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, AlertTriangle, Droplets, MapPin, Activity } from "lucide-react"
import { DatabaseService } from "@/lib/database-service"

interface AnalyticsPanelProps {
  className?: string
}

export function AnalyticsPanel({ className }: AnalyticsPanelProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const data = await DatabaseService.getAnalyticsData()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to load analytics data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAnalyticsData()
  }, [])

  if (loading || !analyticsData) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">Loading analytics...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const riskDistribution = [
    {
      name: "Critical",
      value: analyticsData.riskDistribution.Critical || 0,
      color: "#ef4444",
      percentage: Math.round(((analyticsData.riskDistribution.Critical || 0) / analyticsData.totalStations) * 100),
    },
    {
      name: "High",
      value: analyticsData.riskDistribution.High || 0,
      color: "#f59e0b",
      percentage: Math.round(((analyticsData.riskDistribution.High || 0) / analyticsData.totalStations) * 100),
    },
    {
      name: "Medium",
      value: analyticsData.riskDistribution.Medium || 0,
      color: "#3b82f6",
      percentage: Math.round(((analyticsData.riskDistribution.Medium || 0) / analyticsData.totalStations) * 100),
    },
    {
      name: "Low",
      value: analyticsData.riskDistribution.Low || 0,
      color: "#10b981",
      percentage: Math.round(((analyticsData.riskDistribution.Low || 0) / analyticsData.totalStations) * 100),
    },
  ].filter((item) => item.value > 0)

  const stateData = Object.entries(analyticsData.stateDistribution)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 8) // Top 8 states
    .map(([state, count]) => ({
      state: state.length > 10 ? state.substring(0, 10) + "..." : state,
      stations: count,
    }))

  const overallRisk = Math.round(
    ((analyticsData.riskDistribution.Critical || 0) * 100 +
      (analyticsData.riskDistribution.High || 0) * 70 +
      (analyticsData.riskDistribution.Medium || 0) * 40 +
      (analyticsData.riskDistribution.Low || 0) * 10) /
      analyticsData.totalStations,
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* System Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{analyticsData.totalStations}</p>
              <p className="text-xs text-muted-foreground">Active Stations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">100%</p>
              <p className="text-xs text-muted-foreground">Database Active</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Data Quality</span>
              <span className="text-xs font-medium text-foreground">100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Overall Risk</span>
              <span className="text-xs font-medium text-foreground">{overallRisk}%</span>
            </div>
            <Progress value={overallRisk} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} stations (${riskDistribution.find((d) => d.name === name)?.percentage}%)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                  <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* State-wise Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            State-wise Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#6b7280" fontSize={10} />
                <YAxis type="category" dataKey="state" stroke="#6b7280" fontSize={10} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#374151",
                    border: "1px solid #6b7280",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />
                <Bar dataKey="stations" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            System Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg Water Level</span>
            <span className="text-xs font-medium text-foreground">{analyticsData.averageWaterLevel}m</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg Quality Index</span>
            <span className="text-xs font-medium text-foreground">{analyticsData.averageQuality}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Critical Stations</span>
            <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
              {analyticsData.criticalStations}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Critical Water Levels Detected</p>
              <p className="text-xs text-muted-foreground">
                {analyticsData.criticalStations} stations require immediate attention
              </p>
              <p className="text-xs text-muted-foreground">Database • Live</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Database Connection Active</p>
              <p className="text-xs text-muted-foreground">Real-time monitoring operational</p>
              <p className="text-xs text-muted-foreground">System • Online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
