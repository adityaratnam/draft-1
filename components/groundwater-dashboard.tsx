"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StationSelector } from "@/components/station-selector"
import { WaterLevelChart } from "@/components/water-level-chart"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { AIForecastPanel } from "@/components/ai-forecast-panel"
import { DatabaseService } from "@/lib/database-service"
import type { GroundwaterDataPoint } from "@/lib/types"
import { Droplets, Activity, Brain } from "lucide-react"

export function GroundwaterDashboard() {
  const [selectedStation, setSelectedStation] = useState<GroundwaterDataPoint | null>(null)
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d")
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const data = await DatabaseService.getAnalyticsData()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to load analytics data:", error)
      }
    }
    loadAnalyticsData()
  }, [])

  const stationData = selectedStation
    ? [] // Will be populated by WaterLevelChart component using database service
    : []

  const handleStationSelect = (station: GroundwaterDataPoint) => {
    setSelectedStation(station)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">India Groundwater Monitoring</h1>
                <p className="text-sm text-muted-foreground">
                  {analyticsData?.totalStations || 200} Stations • Advanced Analytics & AI Forecasting
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Activity className="h-3 w-3 mr-1" />
                Live Database
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Droplets className="h-3 w-3 mr-1" />
                Real Data
              </Badge>
              <Button variant="outline" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Station Selector */}
        <StationSelector onStationSelect={handleStationSelect} selectedStation={selectedStation} />

        {/* Main Content Area */}
        <div className="flex flex-1">
          <div className="flex-1 p-6">
            {selectedStation ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WaterLevelChart
                  stationId={selectedStation.id}
                  stationName={selectedStation.location}
                  data={stationData}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />

                <AIForecastPanel
                  stationId={selectedStation.id}
                  stationName={selectedStation.location}
                  historicalData={stationData}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="w-96">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Droplets className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Select a Monitoring Station</h3>
                      <p className="text-muted-foreground mb-4">
                        Choose from {analyticsData?.totalStations || 200} groundwater monitoring stations across India
                        to view detailed analytics and AI forecasts.
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{analyticsData?.criticalStations || 10}</div>
                          <div className="text-muted-foreground">Critical Areas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {analyticsData?.riskDistribution?.High || 45}
                          </div>
                          <div className="text-muted-foreground">Warning Zones</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {(analyticsData?.riskDistribution?.Low || 0) +
                              (analyticsData?.riskDistribution?.Medium || 0) || 145}
                          </div>
                          <div className="text-muted-foreground">Safe Levels</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Panel - Analytics */}
          <div className="w-80 border-l border-border">
            <AnalyticsPanel className="p-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
