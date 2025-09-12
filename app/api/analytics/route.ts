import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: stations, error } = await supabase.from("groundwater_stations").select("*")

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
    }

    if (!stations || stations.length === 0) {
      // Return fallback data if no stations in database
      return NextResponse.json({
        totalStations: 0,
        criticalStations: 0,
        riskDistribution: { Critical: 0, High: 0, Medium: 0, Low: 0 },
        stateDistribution: {},
        averageWaterLevel: 0,
        averageQuality: 0,
      })
    }

    const riskDistribution = stations.reduce(
      (acc, station) => {
        acc[station.risk_level] = (acc[station.risk_level] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const stateDistribution = stations.reduce(
      (acc, station) => {
        acc[station.state] = (acc[station.state] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const averageWaterLevel = stations.reduce((sum, station) => sum + station.water_level_meters, 0) / stations.length
    const averageQuality = stations.reduce((sum, station) => sum + station.quality_index, 0) / stations.length

    return NextResponse.json({
      totalStations: stations.length,
      criticalStations: stations.filter((s) => s.is_critical).length,
      riskDistribution,
      stateDistribution,
      averageWaterLevel: Math.round(averageWaterLevel * 100) / 100,
      averageQuality: Math.round(averageQuality),
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
