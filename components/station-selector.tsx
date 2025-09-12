"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatabaseService } from "@/lib/database-service"
import type { GroundwaterDataPoint } from "@/lib/types"
import { Search, AlertTriangle, Droplets, TrendingDown, TrendingUp, Minus, MapPin, Lightbulb } from "lucide-react"

interface StationSelectorProps {
  onStationSelect: (station: GroundwaterDataPoint) => void
  selectedStation: GroundwaterDataPoint | null
}

export function StationSelector({ onStationSelect, selectedStation }: StationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "critical" | "warning" | "safe">("all")
  const [stations, setStations] = useState<GroundwaterDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStations = async () => {
      try {
        console.log("[v0] Loading all stations without limits...")
        const dbStations = await DatabaseService.getAllStations() // No limit parameter

        if (dbStations.length === 0) {
          // Use fallback data if database is empty
          console.log("[v0] Database empty, using fallback stations")
          const fallbackStations = DatabaseService.getFallbackStations()
          setStations(fallbackStations)
          console.log(`[v0] Loaded ${fallbackStations.length} fallback stations`)
        } else {
          const dataPoints = dbStations.map(DatabaseService.convertStationToDataPoint)
          setStations(dataPoints)
          console.log(`[v0] Loaded ${dataPoints.length} stations from database`)
        }
      } catch (error) {
        console.error("Failed to load stations, using fallback:", error)
        // Use fallback data on error
        const fallbackStations = DatabaseService.getFallbackStations()
        setStations(fallbackStations)
        console.log(`[v0] Error fallback: Loaded ${fallbackStations.length} stations`)
      } finally {
        setLoading(false)
      }
    }
    loadStations()
  }, [])

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.id.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesFilter = true
      if (filterStatus === "critical") {
        matchesFilter = station.riskLevel === "Critical"
      } else if (filterStatus === "warning") {
        matchesFilter = station.riskLevel === "High"
      } else if (filterStatus === "safe") {
        matchesFilter = station.riskLevel === "Low" || station.riskLevel === "Medium"
      }

      return matchesSearch && matchesFilter
    })
  }, [stations, searchTerm, filterStatus])

  const criticalStations = stations.filter((s) => s.riskLevel === "Critical")
  const warningStations = stations.filter((s) => s.riskLevel === "High")
  const safeStations = stations.filter((s) => s.riskLevel === "Low" || s.riskLevel === "Medium")

  const getTrendIcon = (station: GroundwaterDataPoint) => {
    // Simple trend calculation based on water level vs depth ratio
    const ratio = station.waterLevel / station.depth
    if (ratio > 0.7) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (ratio < 0.3) return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-yellow-400" />
  }

  const getTrendText = (station: GroundwaterDataPoint) => {
    const ratio = station.waterLevel / station.depth
    if (ratio > 0.7) return "rising"
    if (ratio < 0.3) return "falling"
    return "stable"
  }

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Critical":
        return "text-red-400 border-red-400"
      case "High":
        return "text-yellow-400 border-yellow-400"
      default:
        return "text-green-400 border-green-400"
    }
  }

  if (loading) {
    return (
      <div className="w-80 border-r border-border bg-card/50 flex items-center justify-center h-full">
        <div className="text-center">
          <Droplets className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading stations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-border bg-card/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Monitoring Stations</h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            {stations.length} Total
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-1">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="text-xs"
          >
            All ({stations.length})
          </Button>
          <Button
            variant={filterStatus === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("critical")}
            className="text-xs"
          >
            Critical ({criticalStations.length})
          </Button>
          <Button
            variant={filterStatus === "warning" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("warning")}
            className="text-xs"
          >
            Warning ({warningStations.length})
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-red-400">{criticalStations.length}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">{warningStations.length}</div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{safeStations.length}</div>
            <div className="text-xs text-muted-foreground">Safe</div>
          </div>
        </div>
      </div>

      {/* Station List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {searchTerm && (
            <div className="px-2 py-1 mb-2 text-xs text-muted-foreground">
              Showing {filteredStations.length} of {stations.length} stations
            </div>
          )}
          {filteredStations.map((station) => (
            <Card
              key={station.id}
              className={`mb-2 cursor-pointer transition-all hover:bg-accent/50 ${
                selectedStation?.id === station.id ? "ring-2 ring-primary bg-accent/30" : ""
              }`}
              onClick={() => onStationSelect(station)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{station.location}</h4>
                    <p className="text-xs text-foreground/80">{station.id}</p>
                  </div>
                  {station.isCritical && <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 ml-2" />}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-400" />
                    <span className="text-xs font-medium text-foreground">{station.waterLevel.toFixed(1)}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(station)}
                    <span className="text-xs text-foreground/90">{getTrendText(station)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-xs ${getStatusColor(station.riskLevel)}`}>
                    {station.riskLevel.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-foreground/80">Quality:</span>
                    <span className="text-foreground font-medium">{station.quality}</span>
                    <span className="text-foreground/80">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Selected Station Details */}
      {selectedStation && (
        <div className="border-t border-border p-4">
          <div className="mb-3">
            <h3 className="font-medium text-sm text-foreground mb-1">{selectedStation.location}</h3>
            <p className="text-xs text-foreground/70">
              {selectedStation.coordinates[0].toFixed(4)}, {selectedStation.coordinates[1].toFixed(4)}
            </p>
          </div>

          {selectedStation.isCritical && (
            <Card className="border-red-400/20 bg-red-400/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1 text-red-400">
                  <Lightbulb className="h-3 w-3" />
                  Resolution Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-24">
                  <ul className="space-y-1">
                    {selectedStation.resolutionSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-xs text-foreground/80">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
