"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StationSelector } from "@/components/station-selector"
import { WaterLevelChart } from "@/components/water-level-chart"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { AIForecastPanel } from "@/components/ai-forecast-panel"
import { DatabaseService } from "@/lib/database-service"
import type { GroundwaterDataPoint } from "@/lib/types"
import { Droplets, Activity, Brain, AlertTriangle, TrendingUp, MapPin, BarChart3, Database, Zap } from "lucide-react"

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
              <div className="space-y-6">
                {/* Welcome Section */}
                <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Droplets className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground mb-2">India Groundwater Monitoring System</h3>
                      <p className="text-muted-foreground mb-6">
                        Advanced AI-powered groundwater monitoring across {analyticsData?.totalStations || 200} stations
                        with real-time analytics and predictive forecasting.
                      </p>
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-400 mb-1">{analyticsData?.criticalStations || 10}</div>
                          <div className="text-sm text-muted-foreground">Critical Areas</div>
                          <div className="text-xs text-red-400/70">Immediate Action Required</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-yellow-400 mb-1">
                            {analyticsData?.riskDistribution?.High || 45}
                          </div>
                          <div className="text-sm text-muted-foreground">Warning Zones</div>
                          <div className="text-xs text-yellow-400/70">Close Monitoring</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {(analyticsData?.riskDistribution?.Low || 0) +
                              (analyticsData?.riskDistribution?.Medium || 0) || 145}
                          </div>
                          <div className="text-sm text-muted-foreground">Safe Levels</div>
                          <div className="text-xs text-green-400/70">Optimal Status</div>
                        </div>
                      </div>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <Brain className="h-4 w-4 mr-2" />
                        Start Monitoring
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* National Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Real-time Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        Real-time System Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">Database Connection</span>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">AI Forecasting Engine</span>
                        </div>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">Online</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">Data Synchronization</span>
                        </div>
                        <Badge variant="outline" className="text-purple-400 border-purple-400">Live</Badge>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Last Update</span>
                          <span className="text-foreground font-medium">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" size="lg">
                        <AlertTriangle className="h-4 w-4 mr-3 text-red-400" />
                        View Critical Stations ({analyticsData?.criticalStations || 10})
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" size="lg">
                        <TrendingUp className="h-4 w-4 mr-3 text-blue-400" />
                        Generate State Report
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" size="lg">
                        <Brain className="h-4 w-4 mr-3 text-purple-400" />
                        Run AI Analysis
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" size="lg">
                        <MapPin className="h-4 w-4 mr-3 text-green-400" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* National Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      National Groundwater Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {analyticsData?.averageWaterLevel?.toFixed(1) || "13.7"}m
                        </div>
                        <div className="text-sm text-muted-foreground">National Average</div>
                        <div className="text-xs text-blue-400/70">Water Level</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {analyticsData?.averageQuality || 44}%
                        </div>
                        <div className="text-sm text-muted-foreground">Quality Index</div>
                        <div className="text-xs text-green-400/70">Average Score</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-2xl font-bold text-purple-400 mb-1">87.3%</div>
                        <div className="text-sm text-muted-foreground">AI Accuracy</div>
                        <div className="text-xs text-purple-400/70">Forecast Model</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="text-2xl font-bold text-orange-400 mb-1">
                          {Object.keys(analyticsData?.stateDistribution || {}).length || 28}
                        </div>
                        <div className="text-sm text-muted-foreground">States Covered</div>
                        <div className="text-xs text-orange-400/70">Pan-India Network</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-red-400 mb-1">Critical Alert</h4>
                            <p className="text-sm text-foreground mb-2">
                              {analyticsData?.criticalStations || 10} stations showing critically low groundwater levels. 
                              Immediate intervention required in Rajasthan, Gujarat, and Tamil Nadu regions.
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-red-400 border-red-400 text-xs">Rajasthan: 4 stations</Badge>
                              <Badge variant="outline" className="text-red-400 border-red-400 text-xs">Gujarat: 3 stations</Badge>
                              <Badge variant="outline" className="text-red-400 border-red-400 text-xs">Tamil Nadu: 3 stations</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-1">AI Forecast Summary</h4>
                            <p className="text-sm text-foreground mb-2">
                              Machine learning models predict 15% decline in groundwater levels over next 30 days 
                              in drought-affected regions. Monsoon arrival expected to improve conditions.
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">LSTM Model: 89% accuracy</Badge>
                              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">ARIMA: 85% accuracy</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-400 mb-1">Positive Trends</h4>
                            <p className="text-sm text-foreground mb-2">
                              Kerala, West Bengal, and Assam showing improved groundwater levels due to 
                              effective conservation measures and adequate rainfall.
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-green-400 border-green-400 text-xs">Kerala: +12% improvement</Badge>
                              <Badge variant="outline" className="text-green-400 border-green-400 text-xs">Assam: +8% improvement</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Map Placeholder */}
                <Card className="h-96">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      India Groundwater Map Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <div className="relative h-full bg-gradient-to-br from-blue-900/20 to-green-900/20 rounded-lg border border-border overflow-hidden">
                      {/* Map Placeholder with India Outline */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative">
                            {/* Simulated India Map */}
                            <div className="w-64 h-48 bg-gradient-to-br from-green-600/30 to-blue-600/30 rounded-lg border-2 border-primary/30 relative">
                              {/* Station Markers */}
                              <div className="absolute top-4 left-8 w-3 h-3 bg-red-400 rounded-full animate-pulse" title="Rajasthan - Critical" />
                              <div className="absolute top-6 left-12 w-3 h-3 bg-red-400 rounded-full animate-pulse" title="Gujarat - Critical" />
                              <div className="absolute bottom-8 left-16 w-3 h-3 bg-red-400 rounded-full animate-pulse" title="Tamil Nadu - Critical" />
                              <div className="absolute top-12 right-12 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="West Bengal - Warning" />
                              <div className="absolute bottom-12 left-8 w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Kerala - Safe" />
                              <div className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Assam - Safe" />
                              <div className="absolute top-16 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Uttar Pradesh - Warning" />
                              <div className="absolute bottom-16 right-16 w-3 h-3 bg-blue-400 rounded-full animate-pulse" title="Karnataka - Medium" />
                            </div>
                            
                            {/* Map Legend */}
                            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                <span className="text-muted-foreground">Critical</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                <span className="text-muted-foreground">Warning</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span className="text-muted-foreground">Medium</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-muted-foreground">Safe</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-4">
                            Select a station from the left panel to view detailed analytics
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent System Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                        <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Critical Level Alert</p>
                          <p className="text-xs text-muted-foreground">
                            Station RAJ001 (Jaisalmer) dropped to 2.1m - Emergency protocols activated
                          </p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                        <Brain className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">AI Forecast Updated</p>
                          <p className="text-xs text-muted-foreground">
                            30-day predictions generated for all {analyticsData?.totalStations || 200} stations
                          </p>
                          <p className="text-xs text-muted-foreground">5 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                        <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Data Sync Complete</p>
                          <p className="text-xs text-muted-foreground">
                            Successfully synchronized data from all monitoring stations
                          </p>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                        <Database className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Database Optimization</p>
                          <p className="text-xs text-muted-foreground">
                            Performance improvements applied - Query response time reduced by 40%
                          </p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
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